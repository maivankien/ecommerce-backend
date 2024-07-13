import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ApiKey, ApiKeyDocument } from "../entities/api-key.entity";
import { ApiKeyRepositoryInterface } from "../interface/api-key.interface";
import { BaseRepositoryAbstract } from "src/common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class ApiKeyRepository
    extends BaseRepositoryAbstract<ApiKey>
    implements ApiKeyRepositoryInterface {
    constructor(
        @InjectModel(ApiKey.name)
        private readonly apiKeyModel: Model<ApiKeyDocument>
    ) {
        super(apiKeyModel)
    }
}