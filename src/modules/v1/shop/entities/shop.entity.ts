import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { StatusShopEnum } from "@common/enums/common.enum";


export type ShopDocument = HydratedDocument<Shop>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
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