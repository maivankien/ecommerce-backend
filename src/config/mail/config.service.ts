import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class MailConfigService {
    constructor(private readonly configService: ConfigService) {
    }

    get host(): string {
        return this.configService.get<string>('mail.host')
    }

    get username(): string {
        return this.configService.get<string>('mail.username')
    }

    get password(): string {
        return this.configService.get<string>('mail.password')
    }

    get encryption(): string {
        return this.configService.get<string>('mail.encryption')
    }

    get from(): string {
        return this.configService.get<string>('mail.from')
    }

    get name(): string {
        return this.configService.get<string>('mail.name')
    }
}