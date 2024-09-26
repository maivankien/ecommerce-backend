import { AuthModule } from "../auth/auth.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { CartModule } from "../cart/cart.module";
import { ProductModule } from "../product/product.module";
import { DiscountModule } from "../discount/discount.module";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";
import { KeyTokenService } from "../auth/services/keytoken.service";
import { KeyTokenRepository } from "../auth/repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "../auth/entities/keytoken.entity";


@Module({
    imports: [
        AuthModule,
        CartModule,
        ProductModule,
        DiscountModule,
        MongooseModule.forFeature([
            { name: KeyToken.name, schema: KeyTokenSchema },
        ])
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        },
    ],
})
export class OrderModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(OrderController)
    }
}