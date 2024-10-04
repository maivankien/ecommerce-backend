import { BadRequestException, ForbiddenException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Comments } from "./entities/comment.entity";
import { CreateCommentDto } from "./dto/create.dto";
import { CommentsRepositoryInterface } from "./interfaces/comment.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { convertToObjectId } from "@common/utils/common.util";
import { PaginationDto } from "@common/dtos/pagination.dto";
import { ProductService } from "../product/services/product.service";


@Injectable()
export class CommentsService extends BaseServiceAbstract<Comments> {
    constructor(
        @Inject('CommentsRepositoryInterface')
        private readonly commentsRepository: CommentsRepositoryInterface,

        private readonly productService: ProductService
    ) {
        super(commentsRepository)
    }

    async createComment(user: PayloadJwt, payload: CreateCommentDto) {
        const { userId } = user
        const { content, parent_id, product_id } = payload
        await this.productService.validateProductExists(product_id)

        const comment = {
            comment_left: 0,
            comment_right: 0,
            comment_content: content,
            comment_user_id: convertToObjectId(userId),
            comment_product_id: convertToObjectId(product_id),
            comment_parent_id: parent_id ? convertToObjectId(parent_id) : null,
        }

        let rightValue = 0

        if (parent_id) {
            const parentComment = await this.commentsRepository.findOneById(parent_id)

            if (!parentComment) {
                throw new BadRequestException('Parent comment not found')
            }

            rightValue = parentComment.comment_right

            // Update many comments right value
            await this.commentsRepository.updateMany({
                comment_right: { $gte: rightValue },
                comment_product_id: convertToObjectId(product_id),
            }, {
                $inc: { comment_right: 2 }
            })

            // Update many comments left value
            await this.commentsRepository.updateMany({
                comment_left: { $gt: rightValue },
                comment_product_id: convertToObjectId(product_id),
            }, {
                $inc: { comment_left: 2 }
            })

        } else {
            const maxRightValue = await this.commentsRepository.findOne(
                { comment_product_id: convertToObjectId(product_id) },
                { comment_right: 1 },
                { sort: { comment_right: -1 } }
            )

            if (maxRightValue) {
                rightValue = maxRightValue.comment_right + 1
            } else {
                rightValue = 1
            }
        }

        comment.comment_left = rightValue
        comment.comment_right = rightValue + 1

        return this.commentsRepository.create(comment)
    }

    async getCommentsByParentId(productId: string, parentId: string, pagination: PaginationDto) {
        const { limit, page } = pagination
        const skip = (page - 1) * limit

        if (parentId) {
            const parent = await this.commentsRepository.findOneById(parentId, {
                comment_left: 1,
                comment_right: 1
            })

            if (!parent) {
                throw new BadRequestException('Parent comment not found')
            }

            const comments = await this.commentsRepository.find({
                comment_product_id: convertToObjectId(productId),
                comment_left: { $gt: parent.comment_left },
                comment_right: { $lte: parent.comment_right },
            }, {
                comment_left: 1,
                comment_right: 1,
                comment_content: 1,
                comment_parent_id: 1
            },
                { limit, skip, sort: { comment_left: 1 } })

            return comments
        }

        const comments = await this.commentsRepository.find({
            comment_product_id: convertToObjectId(productId),
            comment_parent_id: null
        }, {
            comment_left: 1,
            comment_right: 1,
            comment_content: 1,
            comment_parent_id: 1
        },
            { limit, skip, sort: { comment_left: 1 } })

        return comments
    }

    async deleteComments(productId: string, commentId: string, userId: string) {
        await this.productService.validateProductExists(productId)

        const comment = await this.commentsRepository.findOneById(commentId, { comment_left: 1, comment_right: 1, comment_user_id: 1 })

        if (!comment) {
            throw new NotFoundException('Comment not found')
        }

        if (comment.comment_user_id.toString() !== userId) {
            throw new ForbiddenException('You are not allowed to delete this comment')
        }

        const leftValue = comment.comment_left
        const rightValue = comment.comment_right

        // Calculate width of comment
        const width = rightValue - leftValue + 1

        await this.commentsRepository.deleteMany({
            comment_left: { $gte: leftValue, $lte: rightValue },
            comment_product_id: convertToObjectId(productId)
        })

        // Update many comments right value
        await this.commentsRepository.updateMany({
            comment_right: { $gt: rightValue },
            comment_product_id: convertToObjectId(productId),
        }, {
            $inc: { comment_right: -width }
        })

        // Update many comments left value
        await this.commentsRepository.updateMany({
            comment_left: { $gt: rightValue },
            comment_product_id: convertToObjectId(productId),
        }, {
            $inc: { comment_left: -width }
        })
    }
}