import { MiddlewareConsumer, Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./entities/cart.entity";
import { CartRepository } from "./repositories/cart.repository";
import { ProductModule } from "../product/product.module";
import { AuthModule } from "../auth/auth.module";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";


@Module({
    imports: [
        AuthModule,
        ProductModule,
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema },
        ])
    ],
    controllers: [CartController],
    providers: [
        CartService,
        {
            provide: 'CartRepositoryInterface',
            useClass: CartRepository
        }
    ],
    exports: [
        CartService
    ]
})
export class CartModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(CartController)
    }
}