import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MongodbConfigService {
    constructor(private configService: ConfigService) { }

    get uri(): string {
        return this.configService.get<string>('mongodb.uri')
    }

    get dbName(): string {
        return this.configService.get<string>('mongodb.dbName')
    }
}
