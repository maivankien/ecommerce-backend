import slugify from 'slugify'
import { ProductTypeEnum } from "@common/enums/product.enum";
import { Shop } from "@modules/v1/shop/entities/shop.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { ProductType } from "../interface/product-type.interface";

export type ProductDocument = HydratedDocument<Product>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'products'
})
export class Product extends BaseMongoDBEntity {
    @Prop({ required: true })
    product_name: string

    @Prop({ required: true })
    product_thumb: string

    @Prop({ required: false })
    product_slug: string

    @Prop({ required: true })
    product_description: string

    @Prop({ required: true })
    product_price: number

    @Prop({ required: true })
    product_quantity: number

    @Prop({ required: true, enum: ProductTypeEnum })
    product_type: ProductTypeEnum

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop: Types.ObjectId

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    product_attributes: ProductType

    @Prop({ required: false, type: Number, default: 4.5, min: 1, max: 5, set: (value: number) => Math.round(value * 10) / 10 })
    product_ratings_average: number

    @Prop({ type: [String], default: [] })
    product_variations: string[]

    @Prop({ type: Boolean, default: true, index: true, select: false })
    isDraft: boolean

    @Prop({ type: Boolean, default: false, index: true, select: false })
    isPublished: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)

// Create index
ProductSchema.index({ product_name: 'text', product_description: 'text' })

// Create slug
ProductSchema.pre('save', function (next: Function) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})