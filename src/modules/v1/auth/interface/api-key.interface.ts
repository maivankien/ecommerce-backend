import { ApiKey } from "../entities/api-key.entity";
import { BaseRepositoryInterface } from "src/common/mongo/base/repositories/base.interface.repository";


export type ApiKeyRepositoryInterface = BaseRepositoryInterface<ApiKey>