import * as amqp from 'amqplib';
import { Module, Global } from '@nestjs/common';
import { RabbitMQConfigService } from 'src/config/rabbitmq/config.service';
import { RabbitMQConfigModule } from 'src/config/rabbitmq/config.module';


@Global()
@Module({
    imports: [RabbitMQConfigModule],
    providers: [
        RabbitMQConfigService,
        {
            provide: 'RABBITMQ_CONNECTION',
            useFactory: async (configService: RabbitMQConfigService) => {
                const connection = await amqp.connect(configService.urls)
                connection.on('error', (err) => {
                    console.error(`AMQP Connection error: ${err.message}`)
                })
                connection.on('close', () => {
                    console.warn('AMQP Connection closed')
                })
                return connection
            },
            inject: [RabbitMQConfigService]
        },
        {
            provide: 'RABBITMQ_CHANNEL',
            useFactory: async (connection: amqp.Connection) => {
                const channel = await connection.createChannel()
                channel.on('error', (err) => {
                    console.error(`AMQP Channel error: ${err.message}`)
                })
                channel.on('close', () => {
                    console.warn('AMQP Channel closed')
                })
                return channel
            },
            inject: ['RABBITMQ_CONNECTION']
        }
    ],
    exports: ['RABBITMQ_CONNECTION', 'RABBITMQ_CHANNEL']
})
export class RabbitMQModule { }
