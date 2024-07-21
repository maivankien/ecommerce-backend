import { Product } from "./product.entity";
import { HydratedDocument, Types } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { Shop } from "@modules/v1/shop/entities/shop.entity";


export type InventoryDocument = HydratedDocument<Inventory>

@Schema({
    timestamps: true,
    collection: 'inventories'
})
export class Inventory extends BaseMongoDBEntity {
    @Prop({ required: true, type: Types.ObjectId, ref: Product.name })
    inven_product_id: Types.ObjectId

    @Prop({ required: true, default: 'unKnow' })
    inven_location: string

    @Prop({ required: true })
    inven_stock: number

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    inven_shop_id: Types.ObjectId

    @Prop({ type: Array, default: [] })
    inven_reservations: any[]
}

export const InventorySchema = SchemaFactory.createForClass(Inventory)