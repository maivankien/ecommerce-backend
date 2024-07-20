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
import { KeyTokenService } from "../auth/services/keytoken.service";
import { ProductServiceFactory } from "@common/factories/product/product.factory";
import { KeyTokenRepository } from "../auth/repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "../auth/entities/keytoken.entity";
import { ClothingServiceFactory } from "@common/factories/product/clothing.factory";
import { ElectronicsServiceFactory } from "@common/factories/product/electronic.factory";
import { FurnituresServiceFactory } from "@common/factories/product/furiture.factory";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Product.name, schema: ProductSchema },
            { name: Clothing.name, schema: ClothingSchema },
            { name: KeyToken.name, schema: KeyTokenSchema },
            { name: Electronics.name, schema: ElectronicsSchema },
            { name: Furnitures.name, schema: FurnituresSchema }
        ])
    ],
    controllers: [ProductController],
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
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        }
    ],
    exports: [ProductService]
})
export class ProductModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(
            { path: 'v1/product/create', method: RequestMethod.POST }
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