import { DocumentBuilder } from '@nestjs/swagger';
import { HeaderApiEnum } from 'src/common/enums/common.enum';


export const createSwaggerConfig = () => {
    return new DocumentBuilder()
        .setTitle('Backend Ecommerce Api')
        .setDescription('Learning from a Tips JavaScript channel. Built with NestJS.')
        .addApiKey({ type: 'apiKey', name: HeaderApiEnum.API_KEY, in: 'header' }, 'Api-Key')
        .addSecurityRequirements('Api-Key')
        .setVersion('1.0')
        .build()
}
