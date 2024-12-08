import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoDBEntity } from '@common/mongo/base/base.mongo.entity';

export type ResourceDocument = HydratedDocument<Resource>;


@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    collection: 'resources',
})
export class Resource extends BaseMongoDBEntity {
    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    slug: string

    @Prop({ default: '' })
    description: string
}

export const ResourceSchema = SchemaFactory.createForClass(Resource)
