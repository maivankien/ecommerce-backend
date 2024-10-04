import { Comments } from "../entities/comment.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";


export type CommentsRepositoryInterface = BaseRepositoryInterface<Comments>