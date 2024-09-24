import { HydratedDocument, Types } from "mongoose";
import { Shop } from "@modules/v1/shop/entities/shop.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { DiscountAppliesToEnum, DiscountTypeEnum } from "@common/enums/product.enum";

export type DiscountDocument = HydratedDocument<Discount>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'discounts'
})
export class Discount extends BaseMongoDBEntity {
    @Prop({ required: true, type: String })
    discount_name: string

    @Prop({ required: true, type: String })
    discount_description: string

    @Prop({ type: String, default: DiscountTypeEnum.FIXED_AMOUNT })
    discount_type: DiscountTypeEnum

    @Prop({ type: Number, required: true })
    discount_value: number

    @Prop({ type: String, required: true })
    discount_code: string

    @Prop({ type: Date, required: true })
    discount_start_date: Date

    @Prop({ type: Date, required: true })
    discount_end_date: Date

    // Maximum number of times a discount can be used
    @Prop({ type: Number, required: true })
    discount_max_uses: number

    // Number of times a discount has been used
    @Prop({ type: Number, required: true })
    discount_uses_count: number

    // List of users who have used the discount
    @Prop({ type: [Types.ObjectId], default: [] })
    discount_users_used: Types.ObjectId[]

    // Maximum number of times a discount can be used by a user
    @Prop({ type: Number, required: true })
    discount_max_uses_per_user: number

    // Minimum order value required to use the discount
    @Prop({ type: Number, required: true, default: 0 })
    discount_min_order_value: number

    @Prop({ type: Number, required: true, default: 0 })
    discount_max_order_value: number

    @Prop({ type: Types.ObjectId, required: true, ref: Shop.name })
    discount_shop_id: Types.ObjectId

    // Whether the discount is active or not
    @Prop({ type: Boolean, default: true })
    discount_is_active: boolean

    @Prop({ type: String, required: true })
    discount_applies_to: DiscountAppliesToEnum

    // List of product ids the discount applies to
    @Prop({ type: [Types.ObjectId], default: [] })
    discount_product_ids: Types.ObjectId[]
}

export const DiscountSchema = SchemaFactory.createForClass(Discount)