import slugify from 'slugify'
import { Shop } from "@modules/v1/shop/entities/shop.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Schema as MongooseSchema, Types } from "mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";

export type ProductSpuDocument = HydratedDocument<ProductSpu>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'spus'
})
export class ProductSpu extends BaseMongoDBEntity {
    @Prop({ required: true })
    product_id: string

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
    product_category: any[]

    @Prop({ required: true })
    product_quantity: number

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop: Types.ObjectId

    @Prop({ required: true, type: MongooseSchema.Types.Mixed })
    product_attributes: any

    @Prop({ required: false, type: Number, default: 4.5, min: 1, max: 5, set: (value: number) => Math.round(value * 10) / 10 })
    product_ratings_average: number

    @Prop({ default: [] })
    product_variations: any[]

    /*
        tier_varation: [
            {
                name: 'Color,
                images: [],
                options: ['Red', 'Blue', 'Green']
            },
            {
                name: 'Size',
                images: [],
                options: ['S', 'M', 'L', 'XL']
            }
        ]
    */

    @Prop({ type: Boolean, default: true, index: true, select: false })
    isDraft: boolean

    @Prop({ type: Boolean, default: false, index: true, select: false })
    isPublished: boolean
}

export const ProductSpuSchema = SchemaFactory.createForClass(ProductSpu)

// Create index
ProductSpuSchema.index({ product_name: 'text', product_description: 'text' })

// Create slug
ProductSpuSchema.pre('save', function (next: Function) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})