import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationConsumerService } from "./notification.service";

@Module({
    imports: [],
    controllers: [NotificationController],
    providers: [NotificationConsumerService]
})
export class NotificationModule {}