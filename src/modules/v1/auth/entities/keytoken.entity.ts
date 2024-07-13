import { Types } from "mongoose";
import { HydratedDocument } from "mongoose";
import { Shop } from "@modules/v1/shop/entities/shop.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";


export type KeyTokenDocument = HydratedDocument<KeyToken>


@Schema({
    timestamps: true,
    collection: 'keys'
})
export class KeyToken extends BaseMongoDBEntity {
    @Prop({ type: Types.ObjectId, required: true, ref: Shop.name })
    user: Types.ObjectId

    @Prop({ type: String, required: true })
    publicKey: string

    @Prop({ type: String, required: true })
    privateKey: string

    @Prop({ type: [String], required: false, default: [] })
    refreshToken: string[]
}

export const KeyTokenSchema = SchemaFactory.createForClass(KeyToken)
