import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type CommentsDocument = HydratedDocument<Comments>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'comments'
})
export class Comments extends BaseMongoDBEntity {
    @Prop({ required: true })
    comment_user_id: Types.ObjectId

    @Prop({ required: true, type: Types.ObjectId, ref: Product.name })
    comment_product_id: Types.ObjectId

    @Prop({ required: true })
    comment_content: string

    @Prop({ required: true, default: 0 })
    comment_left: number

    @Prop({ required: true, default: 0 })
    comment_right: number

    @Prop({ required: false, type: Types.ObjectId, ref: Comments.name })
    comment_parent_id: Types.ObjectId
}


export const CommentsSchema = SchemaFactory.createForClass(Comments)