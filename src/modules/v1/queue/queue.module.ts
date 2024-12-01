import { Module } from "@nestjs/common";
import { QueueController } from "./queue.controller";
import { RabbitMQProviderModule } from "src/providers/queues/rabbitmq/provider.module";

@Module({
    imports: [
        RabbitMQProviderModule
    ],
    controllers: [
        QueueController
    ],
    providers: []
})
export class QueueModule {}