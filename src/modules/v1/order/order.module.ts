import { AuthModule } from "../auth/auth.module";
import { MiddlewareConsumer, Module } from "@nestjs/common";
import { OrderController } from "./order.controller";
import { OrderService } from "./order.service";
import { CartModule } from "../cart/cart.module";
import { ProductModule } from "../product/product.module";
import { DiscountModule } from "../discount/discount.module";
import { MongooseModule } from "@nestjs/mongoose";
import { RedisOrderService } from "./services/redis.service";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";
import { Order, OrderSchema } from "./entities/order.entity";
import { OrderRepository } from "./repositories/order.repository";


@Module({
    imports: [
        AuthModule,
        CartModule,
        ProductModule,
        DiscountModule,
        MongooseModule.forFeature([
            { name: Order.name, schema: OrderSchema}
        ])
    ],
    controllers: [OrderController],
    providers: [
        OrderService,
        {
            provide: 'OrderRepositoryInterface',
            useClass: OrderRepository
        },
        RedisOrderService,
    ],
})
export class OrderModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(OrderController)
    }
}