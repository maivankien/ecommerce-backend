import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KafkaConfigService } from './config.service';


@Module({
    imports: [ConfigModule.forRoot({
        load: [configuration]
    })],
    providers: [ConfigService, KafkaConfigService],
    exports: [ConfigService, KafkaConfigService],
})
export class KafkaConfigModule { }
