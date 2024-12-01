import { ApiVersionEnum } from "@common/enums/common.enum";
import { AmqpConnection } from "@golevelup/nestjs-rabbitmq";
import { Controller, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Test Message Queue')
@Controller({
    version: ApiVersionEnum.V1
})
export class QueueController {
    constructor(
        private readonly amqpConnection: AmqpConnection,
    ) { }


    @Post('send-message')
    async sendMessage() {
        const message = "Hello World"
        const notificationExchange = 'notification_exchange'  // Notification exchange direct

        await this.amqpConnection.publish(
            notificationExchange,
            '',
            message,
            {
                expiration: "10000"
            }
        )
    }
}