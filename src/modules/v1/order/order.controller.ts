import { Response } from "express";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { OrderService } from "./order.service";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { CheckoutReviewDto } from "./dto/order.dto";
import { SuccessResponse } from "@common/core/success.response";


@ApiTags('Order')
@Controller({ version: ApiVersionEnum.V1 })
export class OrderController {
    constructor(
        private readonly orderService: OrderService
    ) {}

    @Post()
    async checkoutReview(@RequestData('user') user: PayloadJwt, @Body() payload: CheckoutReviewDto, @Res() res: Response) {
        const result = await this.orderService.checkoutReview(user.userId, payload)

        return SuccessResponse(res, 'Checkout review successfully!', result)
    }
}