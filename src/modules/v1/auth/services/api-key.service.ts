import { Inject, Injectable } from "@nestjs/common";
import { ApiKey } from "../entities/api-key.entity";
import { ApiKeyRepositoryInterface } from "../interface/api-key.interface";
import { BaseServiceAbstract } from "src/common/mongo/base/services/base.abstract.service";


@Injectable()
export class ApiKeyService extends BaseServiceAbstract<ApiKey> {
    constructor(
        @Inject('ApiKeyRepositoryInterface')
        private readonly apiKeyRepository: ApiKeyRepositoryInterface
    ) {
        super(apiKeyRepository)
    }
}