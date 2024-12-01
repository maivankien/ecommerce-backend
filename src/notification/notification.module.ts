import { Module } from "@nestjs/common";
import { NotificationController } from "./notification.controller";
import { NotificationConsumerService } from "./notification.service";
import { RabbitMQConfigModule } from "src/config/rabbitmq/config.module";

@Module({
    imports: [
        RabbitMQConfigModule
    ],
    controllers: [NotificationController],
    providers: [NotificationConsumerService]
})
export class NotificationModule {}