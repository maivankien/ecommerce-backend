import * as amqp from 'amqplib';
import { Inject, Injectable, OnModuleInit } from '@nestjs/common';


@Injectable()
export class NotificationConsumerService implements OnModuleInit {
    constructor(
        @Inject('RABBITMQ_CHANNEL')
        private readonly channel: amqp.Channel
    ) { }

    // Queue and Exchange names
    private readonly notiQueue = 'notification_queue_process'
    private readonly dlxExchange = 'notification_exchange_DLX'
    private readonly dlxRoutingKey = 'notification_routing_key_DLX'
    private readonly notiQueueHandle = 'notification_queue_hot_fix'

    async onModuleInit() {
        try {
            // Setup Dead Letter Exchange and Queues first
            await this.setupDLX()

            // Start consumers
            this.consumeNormalQueue()
            this.consumeFailedQueue()

            console.log('RabbitMQ Service initialized successfully')
        } catch (error) {
            console.error(`Failed to initialize RabbitMQ Service: ${error.message}`)
            throw error
        }
    }

    async setupDLX() {
        // Assert DLX Exchange
        await this.channel.assertExchange(this.dlxExchange, 'direct', {
            durable: true,
        })

        // Assert Failed Queue (Hot Fix Queue)
        await this.channel.assertQueue(this.notiQueueHandle, {
            durable: true,
        })

        // Bind Failed Queue to DLX
        await this.channel.bindQueue(this.notiQueueHandle, this.dlxExchange, this.dlxRoutingKey)

        // Assert Main Queue with DLX settings
        await this.channel.assertQueue(this.notiQueue, {
            durable: true,
            deadLetterExchange: this.dlxExchange,
            deadLetterRoutingKey: this.dlxRoutingKey,
            // Optional: Set message TTL or other queue-level settings here
        })

        console.log(`DLX and Failed Queue '${this.notiQueueHandle}' set up successfully`)
    }

    consumeNormalQueue() {
        this.channel.consume(
            this.notiQueue,
            async (message: amqp.ConsumeMessage) => {
                if (message == null) {
                    return console.warn('Received null message')
                }

                try {
                    // Simulate processing
                    const numberTest = Math.random()
                    const content = message.content.toString()

                    if (numberTest < 0.5) {
                        throw new Error('Send message failed (Hot fix) ...')
                    }

                    console.log(`Sending message successfully: ${content}`)
                    this.channel.ack(message)
                } catch (error) {
                    console.error(error.message)
                    // Nack the message without requeueing it will be sent to DLX
                    this.channel.nack(message, false, false)
                }
            },
            {
                noAck: false, // Enable manual acknowledgments
            }
        )
    }

    consumeFailedQueue() {
        // Assert and bind the failed queue (DLQ)
        this.channel.assertQueue(this.notiQueueHandle, {
            durable: true
        })

        this.channel.bindQueue(this.notiQueueHandle, this.dlxExchange, this.dlxRoutingKey)

        this.channel.consume(
            this.notiQueueHandle,
            (message: amqp.ConsumeMessage) => {
                if (message === null) {
                    return console.warn('Received null message')
                }

                const content = message.content.toString()
                console.warn(`Sending message failed (Hot fix): ${content}`)
                // Acknowledge the message since it's handled
                this.channel.ack(message)
            },
            {
                noAck: false, // Enable manual acknowledgments
            }
        )
    }
}
