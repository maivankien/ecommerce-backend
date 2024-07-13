import { KeyObject } from "crypto";
import { ObjectId, Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { KeyToken } from "../entities/keytoken.entity";
import { KeyTokenRepositoryInterface } from "../interface/keytoken.interface";
import { BaseServiceAbstract } from "src/common/mongo/base/services/base.abstract.service";


@Injectable()
export class KeyTokenService extends BaseServiceAbstract<KeyToken> {
    constructor(
        @Inject('KeyTokenRepositoryInterface')
        private readonly keyTokenRepository: KeyTokenRepositoryInterface
    ) {
        super(keyTokenRepository)
    }

    public async createKeyToken(input: { userId: Types.ObjectId, publicKey: string, privateKey: string }): Promise<string> {
        const { userId, publicKey, privateKey } = input

        const tokens = await this.keyTokenRepository.create({
            user: userId,
            publicKey: publicKey.toString(),
            privateKey: privateKey.toString()
        } as KeyToken)

        return tokens ? tokens.publicKey : null
    }
}