import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RabbitMQConfigService } from './config.service';


@Module({
    imports: [ConfigModule.forRoot({
        load: [configuration]
    })],
    providers: [ConfigService, RabbitMQConfigService],
    exports: [ConfigService, RabbitMQConfigService],
})
export class RabbitMQConfigModule { }
