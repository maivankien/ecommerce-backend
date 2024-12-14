import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";

export type ProductSkuDocument = HydratedDocument<ProductSku>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'skus'
})
export class ProductSku extends BaseMongoDBEntity {
    @Prop({ required: true, unique: true })
    sku_id: string

    @Prop({ required: true, default: [0] })
    sku_tier_idx: number[]

    /**
     *  color = [RED, GREEN] = [0, 1]
     *  size = [S, M, L] = [0, 1, 2]
     * 
     *  => RED + S = [0, 0]
     *  => RED + M = [0, 1]
     */

    @Prop({ required: true, default: false })
    sku_default: boolean

    @Prop({ required: false, default: "" })
    sku_slug: string

    @Prop({ required: true, default: 0 })
    sku_sort: number

    @Prop({ required: true })
    sku_price: string

    @Prop({ required: true, default: 0 })
    sku_stock: number

    @Prop({ required: true, ref: ProductSku.name })
    product_id: string

    @Prop({ type: Boolean, default: true, index: true, select: false })
    isDraft: boolean

    @Prop({ type: Boolean, default: false, index: true, select: false })
    isPublished: boolean
}

export const ProductSkuSchema = SchemaFactory.createForClass(ProductSku)