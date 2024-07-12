import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfigService } from './config/app/config.service';
import { INestApplication, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')

    app.enableVersioning({
        type: VersioningType.URI,
    })

    const swaggerConfig = new DocumentBuilder()
        .setTitle('Backend Ecommerce Api')
        .setDescription('Learning from a Tips JavaScript channel. Built with NestJS.')
        .setVersion('1.0')
        .build()

    app.enableCors()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)

    await app.init()

    const appConfig: AppConfigService = app.get(AppConfigService)

    await app.listen(appConfig.port)
}
bootstrap()
