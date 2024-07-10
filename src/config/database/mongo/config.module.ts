import { Module } from '@nestjs/common';
import configuration from './configuration';
import { MongodbConfigService } from './config.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [ConfigModule.forRoot({
        load: [configuration]
    })],
    providers: [ConfigService, MongodbConfigService],
    exports: [ConfigService, MongodbConfigService],
})
export class MongodbConfigModule { }
