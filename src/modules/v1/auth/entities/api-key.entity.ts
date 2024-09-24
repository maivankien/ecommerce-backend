import { HydratedDocument } from "mongoose";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { PermissionApiKeyEnum } from "@common/enums/common.enum";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";


export type ApiKeyDocument = HydratedDocument<ApiKey>


@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'api_keys'
})
export class ApiKey extends BaseMongoDBEntity {
    @Prop({ type: String, required: true, unique: true })
    key: string

    @Prop({ type: Boolean, default: true })
    status: boolean

    @Prop({ type: [String], required: true, enum: Object.values(PermissionApiKeyEnum) })
    permissions: string[]
}

export const ApiKeySchema = SchemaFactory.createForClass(ApiKey)
