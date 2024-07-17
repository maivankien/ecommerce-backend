import { ApiKey } from "@modules/v1/auth/entities/api-key.entity";
import { KeyToken } from "@modules/v1/auth/entities/keytoken.entity";


export interface CustomRequest extends Request {
    user?: PayloadJwt
    objKey?: ApiKey
    keyStore?: KeyToken
    refreshToken?: string
}

export interface PayloadJwt {
    userId: string
    email: string
    roles: string[]
}