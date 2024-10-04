import { Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Query, Res } from "@nestjs/common";
import { CommentsService } from "./comment.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { CreateCommentDto } from "./dto/create.dto";
import { SuccessResponse } from "@common/core/success.response";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { PaginationDto } from "@common/dtos/pagination.dto";


@ApiTags('Comments')
@Controller({
    version: ApiVersionEnum.V1,
})
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) { }


    @Post()
    async createComment(@Body() payload: CreateCommentDto, @Res() res: Response, @RequestData('user') user: PayloadJwt) {
        const result = await this.commentsService.createComment(user, payload)

        return SuccessResponse(res, 'Comment created successfully', result)
    }

    @Get(":productId")
    @ApiQuery({
        name: 'parentId',
        required: false,
        type: String,
        description: 'Parent comment id'
    })
    async getCommentsByParentId(
        @Res() res: Response,
        @Query() pagination: PaginationDto,
        @Query('parentId') parentId: string,
        @Param('productId') productId: string
    ) {
        const result = await this.commentsService.getCommentsByParentId(productId, parentId, pagination)

        return SuccessResponse(res, 'Comments fetched successfully', result)
    }


    @Delete(":productId/:commentId")
    async deleteComment(
        @Res() res: Response, 
        @RequestData('user') user: PayloadJwt,
        @Param('commentId') commentId: string, 
        @Param('productId') productId: string
    ) {
        const { userId } = user
        await this.commentsService.deleteComments(productId, commentId, userId)

        return SuccessResponse(res, 'Comment deleted successfully')
    }
}