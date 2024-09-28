import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { ApiKey, ApiKeySchema } from "./entities/api-key.entity";
import { ApiKeyService } from "./services/api-key.service";
import { ApiKeyRepository } from "./repositories/api-key.repository";
import { KeyTokenService } from "./services/keytoken.service";
import { KeyTokenRepository } from "./repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "./entities/keytoken.entity";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: ApiKey.name, schema: ApiKeySchema },
            { name: KeyToken.name, schema: KeyTokenSchema },
        ])
    ],
    controllers: [],
    providers: [
        ApiKeyService,
        {
            provide: 'ApiKeyRepositoryInterface',
            useClass: ApiKeyRepository
        },
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        }
    ],
    exports: [
        ApiKeyService,
        {
            provide: 'ApiKeyRepositoryInterface',
            useClass: ApiKeyRepository
        },
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        }
    ]
})
export class AuthModule {}