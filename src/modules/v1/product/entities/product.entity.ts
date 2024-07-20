import { ProductTypeEnum } from "@common/enums/product.enum";
import { Shop } from "@modules/v1/shop/entities/shop.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { ProductType } from "../interface/product-type.interface";


export type ProductDocument = HydratedDocument<Product>

@Schema({
    timestamps: true,
    collection: 'products'
})
export class Product extends BaseMongoDBEntity {
    @Prop({ required: true })
    product_name: string

    @Prop({ required: true })
    product_thumb: string

    @Prop({ required: true })
    product_description: string

    @Prop({ required: true })
    product_price: number

    @Prop({ required: true })
    product_quantity: number

    @Prop({ required: true, enum: ProductTypeEnum })
    product_type: ProductTypeEnum

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop?: Types.ObjectId

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    product_attributes: ProductType
}

export const ProductSchema = SchemaFactory.createForClass(Product)