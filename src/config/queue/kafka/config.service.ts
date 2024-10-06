import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class KafkaConfigService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    get brokers(): string[] {
        return this.configService.get<string[]>('kafka.brokers')
    }

    get clientId(): string {
        return this.configService.get<string>('kafka.clientId')
    }

    get groupId(): string {
        return this.configService.get<string>('kafka.groupId')
    }
}