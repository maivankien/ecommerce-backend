import { Module } from '@nestjs/common';
import { MAX_POOL_SIZE_MONGO, TIME_OUT_CONNECT_MONGO } from '@common/constants/common.constants';
import { MongooseModule, MongooseModuleAsyncOptions } from '@nestjs/mongoose';
import { MongodbConfigModule } from 'src/config/database/mongo/config.module';
import { MongodbConfigService } from 'src/config/database/mongo/config.service';


@Module({
    imports: [
        MongooseModule.forRootAsync({
            imports: [MongodbConfigModule],
            inject: [MongodbConfigService],
            useFactory: async (config: MongodbConfigService) => ({
                uri: config.uri,
                dbName: config.dbName,
                maxPoolSize: MAX_POOL_SIZE_MONGO,
                serverSelectionTimeoutMS: TIME_OUT_CONNECT_MONGO,
            }),
        } as MongooseModuleAsyncOptions),
    ],
})
export class MongoDBProviderModule { }
