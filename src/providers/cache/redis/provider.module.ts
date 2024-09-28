import Redis from 'ioredis';
import { Module, Global } from '@nestjs/common';
import { RedisConfigModule } from '@config/cache/config.module';
import { RedisConfigService } from '@config/cache/config.service';

@Global()
@Module({
    imports: [RedisConfigModule],
    providers: [
        {
            provide: 'REDIS_CLIENT',
            useFactory: (config: RedisConfigService) => {
                return new Redis({
                    db: config.db,
                    host: config.host,
                    port: config.port,
                    password: config.password,
                    username: config.username
                })
            },
            inject: [RedisConfigService]
        }
    ],
    exports: ['REDIS_CLIENT']
})
export class RedisProviderModule { }
