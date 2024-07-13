import { ApiKey } from "@modules/v1/auth/entities/api-key.entity";


export interface RequestApiKey extends Request {
    objKey: ApiKey
}