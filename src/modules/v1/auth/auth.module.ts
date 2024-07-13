import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./entities/api-key.entity";
import { ApiKeyService } from "./services/api-key.service";
import { ApiKeyRepository } from "./repositories/api-key.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ApiKey.name, schema: ApiKeySchema }
        ])
    ],
    controllers: [],
    providers: [
        ApiKeyService,
        {
            provide: 'ApiKeyRepositoryInterface',
            useClass: ApiKeyRepository
        }
    ],
    exports: [
        ApiKeyService,
        {
            provide: 'ApiKeyRepositoryInterface',
            useClass: ApiKeyRepository
        }
    ]
})
export class AuthModule {}