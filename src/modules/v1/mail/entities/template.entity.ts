import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";


export type TemplateDocument = HydratedDocument<Template>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'templates'
})
export class Template extends BaseMongoDBEntity {
    @Prop({ required: true })
    tem_id: number

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    status: string

    @Prop({ required: true })
    html: string
}


export const TemplateSchema = SchemaFactory.createForClass(Template)