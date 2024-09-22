import { MongooseModule } from "@nestjs/mongoose";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { Discount, DiscountSchema } from "./entities/discount.entity";
import { DiscountRepository } from "./repositories/discount.repository";
import { ProductService } from "../product/services/product.service";
import { KeyTokenService } from "../auth/services/keytoken.service";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { Product, ProductSchema } from "../product/entities/product.entity";
import { ProductRepository } from "../product/repositories/product.repository";
import { KeyTokenRepository } from "../auth/repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "../auth/entities/keytoken.entity";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Discount.name, schema: DiscountSchema },
            { name: Product.name, schema: ProductSchema },
            { name: KeyToken.name, schema: KeyTokenSchema },
        ])
    ],
    controllers: [DiscountController],
    providers: [
        DiscountService,
        {
            provide: 'DiscountRepositoryInterface',
            useClass: DiscountRepository
        },
        ProductService,
        {
            provide: 'ProductRepositoryInterface',
            useClass: ProductRepository
        },
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        },
    ],
})
export class DiscountModulle {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(
            { path: 'v1/discount', method: RequestMethod.POST },
            { path: 'v1/discount/shop', method: RequestMethod.GET },
            { path: 'v1/discount/amount', method: RequestMethod.POST },
            { path: 'v1/discount/:id', method: RequestMethod.PATCH },
            { path: 'v1/discount/:id', method: RequestMethod.DELETE },
        )
    }
}