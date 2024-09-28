import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RedisConfigService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    get host(): string {
        return this.configService.get<string>('redis.host')
    }

    get port(): number {
        return this.configService.get<number>('redis.port')
    }

    get password(): string {
        return this.configService.get<string>('redis.password')
    }

    get db(): number {
        return Number(this.configService.get<number>('redis.db'))
    }

    get username(): string {
        return this.configService.get<string>('redis.username')
    }
}