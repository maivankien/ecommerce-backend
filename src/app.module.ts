import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { ShopModule } from './modules/v1/shop/shop.module';
import { AppConfigModule } from './config/app/config.module';
import { AuthModule } from './modules/v1/auth/auth.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongoDBProviderModule } from './providers/database/mongodb/provider.module';
import { ApiKeyMiddleware } from './common/middlewares/auth/api-key.middleware';
import { permissionMiddleware } from './common/middlewares/auth/permission.middleware';
import { PermissionApiKeyEnum } from './common/enums/common.enum';
import { CombinedMiddleware } from './common/middlewares/common/combined.middleware';


@Module({
    imports: [
        AppConfigModule,
        MongoDBProviderModule,
        ShopModule,
        AuthModule,
        RouterModule.register([
            {
                path: 'shop',
                module: ShopModule
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
