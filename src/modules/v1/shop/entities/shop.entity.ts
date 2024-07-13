import { HydratedDocument, ObjectId } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "src/common/mongo/base/base.mongo.entity";
import { StatusShopEnum } from "src/common/enums/common.enum";


export type ShopDocument = HydratedDocument<Shop>

@Schema({
    timestamps: true,
    collection: 'shops'
})
export class Shop extends BaseMongoDBEntity {
    @Prop({ required: true })
    name: string

    @Prop({ required: true, unique: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({
        required: true,
        enum: StatusShopEnum,
        default: StatusShopEnum.INACTIVE
    })
    status: StatusShopEnum

    @Prop({ required: true, default: false })
    verify: boolean

    @Prop({ required: true })
    roles: string[]
}


export const ShopSchema = SchemaFactory.createForClass(Shop)