import { HydratedDocument, Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseMongoDBEntity } from '@common/mongo/base/base.mongo.entity';
import { UserStatusEnum } from '@common/enums/user.enum';
import { Role } from '@modules/v1/rbac/entities/role.entity';


export type UserDocument = HydratedDocument<User>


@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at',
    },
    collection: 'users',
})
export class User extends BaseMongoDBEntity {
    @Prop({ required: true })
    id: string

    @Prop({ required: true })
    slug: string

    @Prop({ required: true })
    name: string

    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    password: string

    @Prop({ required: true })
    salt: string

    @Prop({ default: null })
    sex: string

    @Prop({ default: null })
    phone: string

    @Prop({ default: null })
    avatar: string

    @Prop({ default: null })
    dob: Date

    @Prop({ type: Types.ObjectId, ref: Role.name })
    role: Types.ObjectId

    @Prop({
        default: UserStatusEnum.PENDING,
        enum: UserStatusEnum,
    })
    status: UserStatusEnum
}

export const UserSchema = SchemaFactory.createForClass(User)
