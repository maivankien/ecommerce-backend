import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Comments, CommentsDocument } from "../entities/comment.entity";
import { CommentsRepositoryInterface } from "../interfaces/comment.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class CommentsRepository
    extends BaseRepositoryAbstract<Comments>
    implements CommentsRepositoryInterface {
    constructor(
        @InjectModel(Comments.name)
        private readonly commentsModel: Model<CommentsDocument>
    ) {
        super(commentsModel)
    }
}