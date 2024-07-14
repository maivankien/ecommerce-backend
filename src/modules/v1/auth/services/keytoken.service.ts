import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { KeyToken } from "../entities/keytoken.entity";
import { KeyTokenRepositoryInterface } from "../interface/keytoken.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class KeyTokenService extends BaseServiceAbstract<KeyToken> {
    constructor(
        @Inject('KeyTokenRepositoryInterface')
        private readonly keyTokenRepository: KeyTokenRepositoryInterface
    ) {
        super(keyTokenRepository)
    }

    public async createKeyToken(input: { userId: Types.ObjectId, publicKey: string, privateKey: string, refreshToken: string }): Promise<string> {
        const filter = { user: input.userId }
        const options = { upsert: true, new: true }

        const update = {
            deleted_at: null,
            refreshTokenUsed: [],
            publicKey: input.publicKey,
            privateKey: input.privateKey,
            refreshToken: input.refreshToken
        }
        console.log('update', update)

        const tokens = await this.keyTokenRepository.findOneAndUpdate(filter, update, options)

        return tokens ? tokens.publicKey : null
    }
}