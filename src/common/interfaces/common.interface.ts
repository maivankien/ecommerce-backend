import { ApiKey } from "@modules/v1/auth/entities/api-key.entity";
import { KeyToken } from "@modules/v1/auth/entities/keytoken.entity";


export interface RequestApiKey extends Request {
    objKey: ApiKey
}

export interface CustomRequest extends Request {
    objKey?: ApiKey
    keyStore?: KeyToken
}