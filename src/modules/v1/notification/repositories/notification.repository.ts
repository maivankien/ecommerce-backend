import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";
import { Notifications, NotificationsDocument } from "../entities/notification.entity";
import { NotificationsRepositoryInterface } from "../interfaces/notification.interface";


@Injectable()
export class NotificationsRepository
    extends BaseRepositoryAbstract<Notifications>
    implements NotificationsRepositoryInterface {
    constructor(
        @InjectModel(Notifications.name)
        private readonly notificationsModel: Model<NotificationsDocument>
    ) {
        super(notificationsModel)
    }
}