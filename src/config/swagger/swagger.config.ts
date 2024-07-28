import { DocumentBuilder } from '@nestjs/swagger';
import { HeaderApiEnum } from '@common/enums/common.enum';


export const createSwaggerConfig = () => {
    return new DocumentBuilder()
        .setTitle('Backend Ecommerce API')
        .setDescription('Learning from a Tips JavaScript channel. Built with NestJS.')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.API_KEY, in: 'header' }, 'Api-Key')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.CLIENT_ID, in: 'header' }, 'Client-Id')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.AUTHORIZATION, in: 'header' }, 'Authorization')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.REFRESH_TOKEN, in: 'header' }, 'Refresh-Token')
        .addSecurityRequirements('Api-Key')
        .addSecurityRequirements('Client-Id')
        .addSecurityRequirements('Authorization')
        .addSecurityRequirements('Refresh-Token')
        .setVersion('1.0')
        .build()
}
