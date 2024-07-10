import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule)

    await app.init()

    const appConfig: AppConfigService = app.get(AppConfigService)

    await app.listen(appConfig.port)
}
bootstrap()
