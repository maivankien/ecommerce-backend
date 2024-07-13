import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { KeyToken, KeyTokenDocument } from "../entities/keytoken.entity";
import { KeyTokenRepositoryInterface } from "../interface/keytoken.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class KeyTokenRepository
    extends BaseRepositoryAbstract<KeyToken>
    implements KeyTokenRepositoryInterface {
    constructor(
        @InjectModel(KeyToken.name)
        private readonly keyTokenModel: Model<KeyTokenDocument>
    ) {
        super(keyTokenModel)
    }
}