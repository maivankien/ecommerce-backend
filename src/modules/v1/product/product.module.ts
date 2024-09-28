import { MongooseModule } from "@nestjs/mongoose";
import { ProductController } from "./product.controller";
import { ProductService } from "./services/product.service";
import { Product, ProductSchema } from "./entities/product.entity";
import { ProductRepository } from "./repositories/product.repository";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import {
    Clothing, ClothingSchema, Electronics,
    ElectronicsSchema, Furnitures, FurnituresSchema
}
    from "./entities/product-type.entity";
import {
    ClothingRepository,
    ElectronicsRepository,
    FurnituresRepository
}
    from "./repositories/product-type.repository";
import { AuthModule } from "../auth/auth.module";
import { InventoryService } from "./services/inventory.service";
import { Inventory, InventorySchema } from "./entities/inventory.entity";
import { InventoryRepository } from "./repositories/inventory.repository";
import { ProductServiceFactory } from "@common/factories/product/product.factory";
import { ClothingServiceFactory } from "@common/factories/product/clothing.factory";
import { ElectronicsServiceFactory } from "@common/factories/product/electronic.factory";
import { FurnituresServiceFactory } from "@common/factories/product/furiture.factory";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";
import { InventoryController } from "./controllers/inventory.controller";


@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Clothing.name, schema: ClothingSchema },
            { name: Electronics.name, schema: ElectronicsSchema },
            { name: Furnitures.name, schema: FurnituresSchema },
            { name: Inventory.name, schema: InventorySchema }
        ])
    ],
    controllers: [ProductController, InventoryController],
    providers: [
        ProductService,
        ProductServiceFactory,
        {
            provide: 'ProductRepositoryInterface',
            useClass: ProductRepository
        },
        ClothingServiceFactory,
        {
            provide: 'ClothingRepositoryInterface',
            useClass: ClothingRepository
        },
        ElectronicsServiceFactory,
        {
            provide: 'ElectronicsRepositoryInterface',
            useClass: ElectronicsRepository
        },
        FurnituresServiceFactory,
        {
            provide: 'FurnituresRepositoryInterface',
            useClass: FurnituresRepository
        },
        InventoryService,
        {
            provide: 'InventoryRepositoryInterface',
            useClass: InventoryRepository
        }
    ],
    exports: [ProductService, InventoryService]
})
export class ProductModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(
            { path: 'v1/product/:id', method: RequestMethod.PATCH },
            { path: 'v1/product/create', method: RequestMethod.POST },
            { path: 'v1/product/drafts', method: RequestMethod.GET },
            { path: 'v1/product/publish', method: RequestMethod.GET },
            { path: 'v1/product/publish/:id', method: RequestMethod.PUT },
            { path: 'v1/product/unpublish/:id', method: RequestMethod.PUT },
            { path: 'v1/product/inventory/add-stock', method: RequestMethod.POST },
        )
    }

    constructor(
        private readonly productService: ProductService,
        private readonly clothingServiceFactory: ClothingServiceFactory,
        private readonly electronicsServiceFactory: ElectronicsServiceFactory,
        private readonly furnituresServiceFactory: FurnituresServiceFactory
    ) {
        this.productService.registerProductType(Clothing.name, this.clothingServiceFactory)
        this.productService.registerProductType(Electronics.name, this.electronicsServiceFactory)
        this.productService.registerProductType(Furnitures.name, this.furnituresServiceFactory)
    }
}
