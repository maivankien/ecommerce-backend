import { HydratedDocument } from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity"

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
}

export const ElectronicsSchema = SchemaFactory.createForClass(Electronics)