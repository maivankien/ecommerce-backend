import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class RabbitMQConfigService {
    constructor(
        private readonly configService: ConfigService
    ) { }

    get urls(): string[] {
        return this.configService.get<string[]>('rabbitmq.urls')
    }

    get queue(): string {
        return this.configService.get<string>('rabbitmq.queue')
    }
}