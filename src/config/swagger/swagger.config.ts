import { DocumentBuilder } from '@nestjs/swagger';
import { HeaderApiEnum } from '@common/enums/common.enum';


export const createSwaggerConfig = () => {
    return new DocumentBuilder()
        .setTitle('Backend Ecommerce Api')
        .setDescription('Learning from a Tips JavaScript channel. Built with NestJS.')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.API_KEY, in: 'header' }, 'Api-Key')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.CLIENT_ID, in: 'header' }, 'Client-Id')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.AUTHORIZATION, in: 'header' }, 'Authorization')
        .addSecurityRequirements('Api-Key')
        .addSecurityRequirements('Client-Id')
        .addSecurityRequirements('Authorization')
        .setVersion('1.0')
        .build()
}
