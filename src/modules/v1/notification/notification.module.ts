import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { AuthModule } from "../auth/auth.module";
import { NotificationService } from "./notification.service";
import { Notifications, NotificationsSchema } from "./entities/notification.entity";
import { NotificationsRepository } from "./repositories/notification.repository";
import { NotificationController } from "./notification.controller";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";


@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Notifications.name, schema: NotificationsSchema }
        ])
    ],
    controllers: [NotificationController],
    providers: [
        NotificationService,
        {
            provide: 'NotificationsRepositoryInterface',
            useClass: NotificationsRepository
        }
    ],
    exports: []
})
export class NotificationModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(NotificationController)
    }
}