import { Response } from "express";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { Controller, Get, Query, Res } from "@nestjs/common";
import { NotificationService } from "./notification.service";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { SuccessResponse } from "@common/core/success.response";
import { ApiQuery, ApiTags } from "@nestjs/swagger";
import { NotificationTypeEnum } from "@common/enums/notification.enum";


@ApiTags('Notification')
@Controller({
    version: ApiVersionEnum.V1
})
export class NotificationController {
    constructor(
        private readonly notificationService: NotificationService
    ) {}

    @Get()
    @ApiQuery({
        name: 'type',
        required: false,
        enum: NotificationTypeEnum,
    })
    async getNotifications(@RequestData('user') user: PayloadJwt, @Res() res: Response, @Query('type') type: NotificationTypeEnum) {
        const { userId } = user
        const data = await this.notificationService.getNotiByUserId(userId, type)

        return SuccessResponse(res, 'Get notifications successfully', data)
    }
}