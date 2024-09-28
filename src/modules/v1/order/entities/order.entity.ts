import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { OrderStatusEnum } from "@common/enums/order.enum";

export type OrderDocument = HydratedDocument<Order>

class Checkout {
    @Prop({ required: true })
    feeShip: number

    @Prop({ required: true })
    totalPrice: number

    @Prop({ required: true })
    totalDiscount: number

    @Prop({ required: true })
    totalCheckout: number
}

class Shipping {
    @Prop({ required: true })
    street: string

    @Prop({ required: true })
    city: string

    @Prop({ required: true })
    state: string

    @Prop({ required: true })
    country: string
}

class Product {
    @Prop({ required: true })
    product_id: string

    @Prop({ required: true })
    quantity: number

    @Prop({ required: true })
    price: number
}

class OrderPayment {
    @Prop({ required: true })
    payment_method: string

    @Prop({ required: true })
    payment_status: string
}

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'orders'
})
export class Order extends BaseMongoDBEntity {
    @Prop({ required: true, index: true })
    order_user_id: string

    @Prop({ required: true, type: Checkout })
    order_checkout: Checkout

    @Prop({ required: true, type: Shipping })
    order_shipping: Shipping

    @Prop({ required: true })
    order_payment: OrderPayment

    @Prop({ required: true, type: [Product] })
    order_products: Product[]

    @Prop({ required: true, index: true })
    order_tracking_number: string

    @Prop({ required: true, enum: OrderStatusEnum, default: OrderStatusEnum.PENDING })
    order_status: OrderStatusEnum
}

export const OrderSchema = SchemaFactory.createForClass(Order)
