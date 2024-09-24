import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./entities/cart.entity";
import { CartRepository } from "./repositories/cart.repository";
import { ProductModule } from "../product/product.module";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";
import { KeyTokenService } from "../auth/services/keytoken.service";
import { KeyTokenRepository } from "../auth/repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "../auth/entities/keytoken.entity";


@Module({
    imports: [
        ProductModule,
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
            { name: KeyToken.name, schema: KeyTokenSchema },
        ])
    ],
    controllers: [CartController],
    providers: [
        CartService,
        {
            provide: 'CartRepositoryInterface',
            useClass: CartRepository
        },
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        },
    ],
})
export class CartModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(CartController)
    }
}