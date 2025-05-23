import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule } from '@nestjs/swagger';
import { AppConfigService } from '@config/app/config.service';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { createSwaggerConfig } from '@config/swagger/swagger.config';
import { MyLogger } from '@common/loggers/logger.log';

declare const module: any

async function bootstrap() {
    const app: INestApplication = await NestFactory.create(AppModule)

    app.setGlobalPrefix('api')
    app.useGlobalPipes(new ValidationPipe())
    app.useLogger(app.get(MyLogger))

    app.enableVersioning({
        type: VersioningType.URI,
    })

    const swaggerConfig = createSwaggerConfig()

    app.enableCors()

    const document = SwaggerModule.createDocument(app, swaggerConfig)

    fs.writeFileSync('./swagger.json', JSON.stringify(document, null, 2))
    
    SwaggerModule.setup('docs', app, document, {
        customSiteTitle: 'Backend Ecommerce API',
        swaggerOptions: {
            persistAuthorization: true,
        },
    })

    await app.init()

    const appConfig: AppConfigService = app.get(AppConfigService)

    await app.listen(appConfig.port)

    if (module.hot) {
        module.hot.accept();
        module.hot.dispose(() => app.close())
    }
}
bootstrap()
