import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQConfigModule } from '@config/queue/rabbitmq/config.module';
import { RabbitMQConfigService } from '@config/queue/rabbitmq/config.service';


@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'RABBITMQ_SERVICE',
                imports: [RabbitMQConfigModule],
                inject: [RabbitMQConfigService],
                useFactory: async (config: RabbitMQConfigService) => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: config.urls,
                        queue: config.queue,
                        queueOptions: {
                            durable: false
                        }
                    }
                })
            }
        ])
    ],
    exports: [ClientsModule]
})
export class RabbitMQProviderModule { }
