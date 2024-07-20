import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@config/app/config.service';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { createSwaggerConfig } from '@config/swagger/swagger.config';

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe())

    app.enableVersioning({
        type: VersioningType.URI,
    })

    const swaggerConfig = createSwaggerConfig()

    app.enableCors()

    const document = SwaggerModule.createDocument(app, swaggerConfig)
    SwaggerModule.setup('docs', app, document)

    await app.init()

    const appConfig: AppConfigService = app.get(AppConfigService)

    await app.listen(appConfig.port)
}
bootstrap()
