import { Resource } from './resource.entity';
import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoDBEntity } from '@common/mongo/base/base.mongo.entity';
import { RoleNameEnum, RoleStatusEnum } from '@common/enums/role.enum';


export type RoleDocument = HydratedDocument<Role>


@Schema()
export class Grant {
    @Prop({ type: Types.ObjectId, ref: Resource.name, required: true })
    resource: Types.ObjectId;

    @Prop({ type: [String], required: true })
    actions: string[];

    @Prop({ type: String, default: '*' })
    attributes: string;
}

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    collection: 'roles',
})
export class Role extends BaseMongoDBEntity {
    @Prop({
        default: RoleNameEnum.USER,
        enum: RoleNameEnum,
    })
    name: RoleNameEnum

    @Prop({ required: true })
    slug: string

    @Prop({
        default: RoleStatusEnum.PENDING,
        enum: RoleStatusEnum,
    })
    status: RoleStatusEnum

    @Prop({ default: '' })
    description: string

    @Prop({ type: [Grant], default: [] })
    grants: Grant[]
}

export const RoleSchema = SchemaFactory.createForClass(Role)
