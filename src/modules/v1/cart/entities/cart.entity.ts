import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { CartStateEnum } from "@common/enums/cart.enum";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";


export type CartDocument = HydratedDocument<Cart>

@Schema()
export class CartProduct {
    @Prop({ type: String, required: true })
    product_id: string

    @Prop({ type: String, required: true })
    product_shop_id: string

    @Prop({ type: Number, required: true })
    product_quantity: number

    @Prop({ type: String, required: true })
    product_name: string

    @Prop({ type: Number, required: true })
    product_price: number
}

@Schema({
    timestamps: true,
    collection: 'carts'
})
export class Cart extends BaseMongoDBEntity {
    @Prop({
        required: true,
        type: String,
        enum: CartStateEnum,
        default: CartStateEnum.ACTIVE
    })
    cart_state: CartStateEnum

    @Prop({ type: [CartProduct], required: true })
    cart_products: CartProduct[]

    @Prop({ type: Number, required: true })
    cart_count_product: number

    @Prop({ type: String, required: true })
    cart_user_id: string
}

export const CartSchema = SchemaFactory.createForClass(Cart)