import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { CommentsService } from "./comment.service";
import { CommentsController } from "./comment.controller";
import { Comments, CommentsSchema } from "./entities/comment.entity";
import { CommentsRepository } from "./repositories/comment.repository";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";
import { AuthModule } from "../auth/auth.module";

@Module({
    imports: [
        AuthModule,
        MongooseModule.forFeature([
            { name: Comments.name, schema: CommentsSchema }
        ])
    ],
    controllers: [CommentsController],
    providers: [
        CommentsService,
        {
            provide: 'CommentsRepositoryInterface',
            useClass: CommentsRepository
        }
    ],
    exports: []
})
export class CommentsModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(CommentsController)
    }
}