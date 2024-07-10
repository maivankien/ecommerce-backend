import * as dotenv from 'dotenv';
import { Module } from "@nestjs/common";
import configuration from './configuration';
import { AppConfigService } from "./config.service";
import { ConfigModule, ConfigService } from "@nestjs/config";


const nodeEnv = process.env.NODE_ENV
const path = `.env.${nodeEnv}`
dotenv.config({ path: path })

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [configuration],
            envFilePath: path,
            isGlobal: true
        }),
    ],
    providers: [ConfigService, AppConfigService],
    exports: [ConfigService, AppConfigService],
})
export class AppConfigModule { }
