import { Controller } from "@nestjs/common";
import { MessagePattern } from "@nestjs/microservices";
import { NotificationMessagePayload } from "./interfaces/queue.interface";
import { NOTIFICATION_TOPIC_MESSAGE } from "src/common/constants/notification.constants";

@Controller()
export class NotificationController {
    constructor(

    ) { }


    @MessagePattern(NOTIFICATION_TOPIC_MESSAGE)
    async handleMessage(payload: NotificationMessagePayload) {
        console.log(payload)
    }
}