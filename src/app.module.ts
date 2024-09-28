import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
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


@Module({
    imports: [
        AppConfigModule,
        MongoDBProviderModule,
        RedisProviderModule,
        ShopModule,
        AuthModule,
        ProductModule,
        DiscountModule,
        CartModule,
        OrderModule,
        RouterModule.register([
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
            }
        ])
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(CombinedMiddleware).forRoutes('*')
        consumer.apply(ApiKeyMiddleware).forRoutes('*')
        consumer.apply(permissionMiddleware(PermissionApiKeyEnum.BASIC)).forRoutes('*')
    }
}
