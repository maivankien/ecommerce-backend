import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NotificationModule } from './notification/notification.module';
import { RabbitMQConfigModule } from './config/rabbitmq/config.module';
import { RabbitMQModule } from './providers/rabbitmq.module';

@Module({
    imports: [
        RabbitMQConfigModule,
        RabbitMQModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule { }
