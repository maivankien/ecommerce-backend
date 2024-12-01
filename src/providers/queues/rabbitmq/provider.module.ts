import { Module } from '@nestjs/common';
import { RabbitMQModule } from '@golevelup/nestjs-rabbitmq';
import { RabbitMQConfigModule } from '@config/queue/rabbitmq/config.module';
import { RabbitMQConfigService } from '@config/queue/rabbitmq/config.service';

@Module({
    imports: [
        RabbitMQConfigModule,
        RabbitMQModule.forRootAsync(RabbitMQModule, {
            imports: [RabbitMQConfigModule],
            inject: [RabbitMQConfigService],
            useFactory: async (config: RabbitMQConfigService) => ({
                uri: config.urls,
                exchanges: [
                    {
                        name: 'notification_exchange',
                        type: 'direct',
                        options: { durable: true },
                    },
                    {
                        name: 'notification_exchange_DLX',
                        type: 'direct',
                        options: { durable: true },
                    }
                ],
                queues: [
                    {
                        name: 'notification_queue_process',
                        options: {
                            durable: true,
                            exclusive: false,
                            deadLetterExchange: 'notification_exchange_DLX',
                            deadLetterRoutingKey: 'notification_routing_key_DLX',
                        }
                    }
                ],
                bindings: [
                    {
                        exchange: 'notification_exchange',
                        queue: 'notification_queue_process',
                        routingKey: ''
                    }
                ]
            })
        })
    ],
    exports: [RabbitMQModule],
})
export class RabbitMQProviderModule { }
