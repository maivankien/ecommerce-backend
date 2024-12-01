import * as amqp from 'amqplib';
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";


@Injectable()
export class OrderedService implements OnModuleInit {
    constructor(
        @Inject('RABBITMQ_CHANNEL')
        private readonly channel: amqp.Channel
    ) { }

    private readonly orderedQueue = 'ordered_queue'

    async onModuleInit() {
        await this.setup()

        this.consumerQueue()
    }

    async setup() {
        await this.channel.assertQueue(this.orderedQueue, {
            durable: true
        })

        // Set prefetch to 1 to ensure that the consumer only processes one message at a time
        this.channel.prefetch(1)

        console.log(`Queue ${this.orderedQueue} set up successfully`)
    }

    consumerQueue() {
        this.channel.consume(this.orderedQueue, async (message: amqp.ConsumeMessage) => {
            const messageContent = message.content.toString()

            setTimeout(() => {
                console.log(`Ordered processed: ${messageContent}`)
                this.channel.ack(message)
            }, Math.floor(Math.random() * 1000))
        })
    }
}