import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { RmqOptions, Transport } from '@nestjs/microservices';
import { RabbitMQConfigService } from './config/rabbitmq/config.service';
import { RABBITMQ_DURABLE } from './common/constants/common.constants';


async function bootstrap() {
    const appContext = await NestFactory.createApplicationContext(AppModule)

    const rabbitmqConfig = appContext.get(RabbitMQConfigService)
    const app = await NestFactory.createMicroservice<RmqOptions>(AppModule, {
        transport: Transport.RMQ,
        options: {
            urls: rabbitmqConfig.urls,
            queue: rabbitmqConfig.queue,
            queueOptions: {
                durable: RABBITMQ_DURABLE
            },
            noAck: true,
        }
    })
    await app.listen()
}

bootstrap()
