import { Module } from '@nestjs/common';
import configuration from './configuration';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisConfigService } from './config.service';


@Module({
    imports: [ConfigModule.forRoot({
        load: [configuration]
    })],
    providers: [ConfigService, RedisConfigService],
    exports: [ConfigService, RedisConfigService],
})
export class RedisConfigModule { }
