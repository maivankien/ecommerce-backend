import { AppService } from './app.service';
import { AppController } from './app.controller';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MorganMiddleware } from './common/middlewares/morgan.middleware';
import { HelmetMiddleware } from './common/middlewares/helmet.middleware';
import { CompressionMiddleware } from './common/middlewares/compression.middleware';


@Module({
    imports: [],
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
