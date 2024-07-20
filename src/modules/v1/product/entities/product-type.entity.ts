import { HydratedDocument, Types } from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity"
import { Shop } from "@modules/v1/shop/entities/shop.entity"

// Define the ClothingDocument type
export type ClothingDocument = HydratedDocument<Clothing>

@Schema({
    timestamps: true,
    collection: 'clothers'
})
export class Clothing extends BaseMongoDBEntity {
    @Prop({ required: true })
    brand: string

    @Prop({ required: true })
    size: string

    @Prop({ required: true })
    material: string

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop: Types.ObjectId
}

export const ClothingSchema = SchemaFactory.createForClass(Clothing)


// Define the ElectronicsDocument type
export type ElectronicsDocument = HydratedDocument<Electronics>

@Schema({
    timestamps: true,
    collection: 'electronics'
})
export class Electronics extends BaseMongoDBEntity {
    @Prop({ required: true })
    manufacturer: string

    @Prop({ required: true })
    model: string

    @Prop({ required: true })
    color: number

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop: Types.ObjectId
}

export const ElectronicsSchema = SchemaFactory.createForClass(Electronics)



// Define the FurnituresDocument type
export type FurnituresDocument = HydratedDocument<Furnitures>

@Schema({
    timestamps: true,
    collection: 'furnitures'
})
export class Furnitures extends BaseMongoDBEntity {
    @Prop({ required: true })
    brand: string

    @Prop({ required: true })
    size: string

    @Prop({ required: true })
    material: number

    @Prop({ required: true, type: Types.ObjectId, ref: Shop.name })
    product_shop: Types.ObjectId
}

export const FurnituresSchema = SchemaFactory.createForClass(Furnitures)