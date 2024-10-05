import { HydratedDocument, Types } from "mongoose";
import { BaseMongoDBEntity } from "@common/mongo/base/base.mongo.entity";
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { NotificationTypeEnum } from "@common/enums/notification.enum";


export type NotificationsDocument = HydratedDocument<Notifications>

@Schema({
    timestamps: {
        createdAt: 'created_at',
        updatedAt: 'updated_at'
    },
    collection: 'notifications'
})
export class Notifications extends BaseMongoDBEntity {
    @Prop({ required: true, enum: NotificationTypeEnum, type: String })
    noti_type: NotificationTypeEnum

    @Prop({ required: true, type: Types.ObjectId })
    noti_sender_id: Types.ObjectId

    @Prop({ required: true, type: Types.ObjectId })
    noti_received_id: Types.ObjectId

    @Prop({ required: true, type: String })
    noti_content: string

    @Prop({ required: true, type: Object, default: {} })
    noti_options?: object
}


export const NotificationsSchema = SchemaFactory.createForClass(Notifications)