import { HydratedDocument } from "mongoose";
import { StatusOtpEnum } from "@common/enums/otp.enum";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";


export type OtpDocument = HydratedDocument<Otp>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'otps'
})
export class Otp extends BaseMongoDBEntity {
    @Prop({ required: true })
    email: string

    @Prop({ required: true })
    token: string

    @Prop({
        required: true,
        enum: StatusOtpEnum,
        default: StatusOtpEnum.PENDDING
    })
    status: StatusOtpEnum

    @Prop({
        required: true,
        default: new Date(),
        expires: 60 // 60 seconds
    })
    expired_at: Date
}


export const OtpSchema = SchemaFactory.createForClass(Otp)