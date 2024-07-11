import { ObjectId } from 'mongoose';
import { Prop } from '@nestjs/mongoose';
import { Expose, Transform } from 'class-transformer';


export class BaseMongoDBEntity {
    _id?: ObjectId | string

    @Expose()
    @Transform((value) => value.obj?._id?.toString(), { toClassOnly: true })
    id?: string

    @Prop({ default: null })
    deleted_at?: Date
}
