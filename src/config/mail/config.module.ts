import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { MailConfigService } from "./config.service";
import configuration from './configuration';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration]
        }),
    ],
    providers: [ConfigService, MailConfigService],
    exports: [ConfigService, MailConfigService],
})

export class MailConfigModule { }