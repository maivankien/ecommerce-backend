import { Inject, Injectable } from "@nestjs/common";
import { Notifications } from "./entities/notification.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { NotificationsRepositoryInterface } from "./interfaces/notification.interface";
import { NotificationTypeEnum } from "@common/enums/notification.enum";
import { convertToObjectId } from "@common/utils/common.util";

@Injectable()
export class NotificationService extends BaseServiceAbstract<Notifications> {
    constructor(
        @Inject('NotificationsRepositoryInterface')
        private readonly notificationsRepository: NotificationsRepositoryInterface
    ) {
        super(notificationsRepository)
    }

    async pushNotiToSystem(noti: Notifications) {
        const content = "New notification"

        return await this.notificationsRepository.create({
            noti_content: content,
            noti_type: noti.noti_type,
            noti_options: noti.noti_options,
            noti_sender_id: noti.noti_sender_id,
            noti_received_id: noti.noti_received_id,
        })
    }

    async getNotiByUserId(userId: string, type?: NotificationTypeEnum) {
        const match = {
            noti_received_id: convertToObjectId(userId)
        }

        if (type) match['noti_type'] = type

        return await this.notificationsRepository.aggregate([
            {
                $match: match
            },
            {
                $project: {
                    noti_type: 1,
                    created_at: 1,
                    noti_content: 1,
                    noti_options: 1,
                    noti_sender_id: 1,
                    noti_received_id: 1,
                }
            }
        ])
    }
}