import { AppService } from './app.service';
import { APP_FILTER, RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { ShopModule } from '@modules/v1/shop/shop.module';
import { AppConfigModule } from '@config/app/config.module';
import { AuthModule } from '@modules/v1/auth/auth.module';
import { PermissionApiKeyEnum } from '@common/enums/common.enum';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongoDBProviderModule } from './providers/database/mongodb/provider.module';
import { permissionMiddleware } from '@common/middlewares/auth/permission.middleware';
import { CombinedMiddleware } from '@common/middlewares/common/combined.middleware';
import { ApiKeyMiddleware } from '@common/middlewares/auth/api-key.middleware';
import { ProductModule } from '@modules/v1/product/product.module';
import { DiscountModule } from '@modules/v1/discount/discount.module';
import { CartModule } from '@modules/v1/cart/cart.module';
import { OrderModule } from '@modules/v1/order/order.module';
import { RedisProviderModule } from './providers/cache/redis/provider.module';
import { CommentsModule } from '@modules/v1/comment/comment.module';
import { NotificationModule } from '@modules/v1/notification/notification.module';
import { KafkaProviderModule } from './providers/queues/kafka/provider.module';
import { RabbitMQProviderModule } from './providers/queues/rabbitmq/provider.module';
import { QueueModule } from '@modules/v1/queue/queue.module';
import { UploadModule } from '@modules/v1/uploads/upload.module';
import { RBACModule } from '@modules/v1/rbac/rbac.module';
import { MyLogger } from '@common/loggers/logger.log';
import { AllExceptionsFilter } from '@common/exceptions/exception.filter';
import { LoggerMiddleware } from '@common/middlewares/logger/logger.middleware';


@Module({
    imports: [
        AppConfigModule,
        MongoDBProviderModule,
        RedisProviderModule,
        KafkaProviderModule,
        RabbitMQProviderModule,
        ShopModule,
        AuthModule,
        ProductModule,
        DiscountModule,
        CartModule,
        OrderModule,
        CommentsModule,
        NotificationModule,
        QueueModule,
        UploadModule,
        RBACModule,
        RouterModule.register([
            {
                path: 'rbac',
                module: RBACModule
            },
            {
                path: 'shop',
                module: ShopModule
            },
            {
                path: 'product',
                module: ProductModule
            },
            {
                path: 'discount',
                module: DiscountModule
            },
            {
                path: 'cart',
                module: CartModule
            },
            {
                path: 'order',
                module: OrderModule
            },
            {
                path: 'comment',
                module: CommentsModule
            },
            {
                path: 'notification',
                module: NotificationModule
            },
            {
                path: 'queue',
                module: QueueModule
            },
            {
                path: 'upload',
                module: UploadModule
            }
        ])
    ],
    controllers: [AppController],
    providers: [
        AppService, 
        // LoggerDiscordService,
        MyLogger,
        {
            provide: APP_FILTER,
            useClass: AllExceptionsFilter,
        }
    ],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes('*')
        consumer.apply(CombinedMiddleware).forRoutes('*')
        consumer.apply(ApiKeyMiddleware).forRoutes('*')
        consumer.apply(permissionMiddleware(PermissionApiKeyEnum.BASIC)).forRoutes('*')
    }
}
