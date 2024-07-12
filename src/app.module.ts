import { AppService } from './app.service';
import { RouterModule } from '@nestjs/core';
import { AppController } from './app.controller';
import { ShopModule } from './modules/v1/shop/shop.module';
import { AppConfigModule } from './config/app/config.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MorganMiddleware } from './common/middlewares/morgan.middleware';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { CompressionMiddleware } from './common/middlewares/compression.middleware';
import { MongoDBProviderModule } from './providers/database/mongodb/provider.module';


@Module({
    imports: [
        AppConfigModule,
        MongoDBProviderModule,
        ShopModule,
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
        consumer.apply(MorganMiddleware).forRoutes('*')
        consumer.apply(HelmetMiddleware).forRoutes('*')
        consumer.apply(CompressionMiddleware).forRoutes('*')
    }
}
