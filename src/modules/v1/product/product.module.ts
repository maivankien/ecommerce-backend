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
import { ProductSpuService } from "./services/spu.service";
import { ProductSpuRepository } from "./repositories/spu.repository";
import { ShopModule } from "../shop/shop.module";
import { ProductSkuService } from "./services/sku.service";
import { ProductSkuRepository } from "./repositories/sku.repository";
import { ProductSpu, ProductSpuSchema } from "./entities/spu.entity";
import { ProductSku, ProductSkuSchema } from "./entities/sku.entity";
import { ProductSpuSkuController } from "./controllers/spu-sku.controller";
import { ApiVersionEnum } from "@common/enums/common.enum";


@Module({
    imports: [
        AuthModule,
        ShopModule,
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Clothing.name, schema: ClothingSchema },
            { name: Electronics.name, schema: ElectronicsSchema },
            { name: Furnitures.name, schema: FurnituresSchema },
            { name: Inventory.name, schema: InventorySchema },
            { name: ProductSpu.name, schema: ProductSpuSchema },
            { name: ProductSku.name, schema: ProductSkuSchema }
        ])
    ],
    controllers: [ProductController, ProductSpuSkuController, InventoryController],
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
        },
        ProductSpuService,
        {
            provide: 'ProductSpuRepositoryInterface',
            useClass: ProductSpuRepository
        },
        ProductSkuService,
        {
            provide: 'ProductSkuRepositoryInterface',
            useClass: ProductSkuRepository
        }
    ],
    exports: [ProductService, InventoryService]
})
export class ProductModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(
            { path: 'product/:id', method: RequestMethod.PATCH, version: ApiVersionEnum.V1 },
            { path: 'product/create', method: RequestMethod.POST, version: ApiVersionEnum.V1 },
            { path: 'product/drafts', method: RequestMethod.GET, version: ApiVersionEnum.V1 },
            { path: 'product/publish', method: RequestMethod.GET, version: ApiVersionEnum.V1 },
            { path: 'product/publish/:id', method: RequestMethod.PUT, version: ApiVersionEnum.V1 },
            { path: 'product/unpublish/:id', method: RequestMethod.PUT, version: ApiVersionEnum.V1 },
            { path: 'product/inventory/add-stock', method: RequestMethod.POST, version: ApiVersionEnum.V1 },
            { path: 'product/spu-sku/create', method: RequestMethod.POST, version: ApiVersionEnum.V1 },
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
