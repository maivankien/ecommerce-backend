import { ApiTags } from "@nestjs/swagger";
import { Response } from "express";
import { DiscountService } from "./discount.service";
import { CreateDiscountDto } from "./dtos/create.dto";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { PaginationDto } from "@common/dtos/pagination.dto";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { GetDiscountAmountDto } from "./dtos/amount.dto";
import { SuccessResponse } from "@common/core/success.response";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from "@nestjs/common";


@ApiTags('Discount')
@Controller({ version: ApiVersionEnum.V1 })
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService
    ) { }

    @Post()
    async createDiscountCode(@Body() payload: CreateDiscountDto, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const result = await this.discountService.createDiscountCode({
            ...payload,
            shop_id: user.userId
        })

        return SuccessResponse(res, "Success", result)
    }

    @Post('amount')
    async getDiscountCodeAmount(@RequestData('user') user: PayloadJwt, @Res() res: Response, @Body() payload: GetDiscountAmountDto) {
        const params = {
            userId: user.userId,
            shopId: payload.shop_id,
            codeId: payload.code_id,
            products: payload.products
        }

        const result = await this.discountService.getDiscountAmount(params)

        return SuccessResponse(res, "Success", result)
    }

    @Patch(':id')
    async updateDiscountCode(@Body() payload: CreateDiscountDto, @RequestData('user') user: PayloadJwt, @Param('id') discountId: string, @Res() res: Response) {
        const result = await this.discountService.updateDiscountCode({
            ...payload,
            shop_id: user.userId,
            discount_id: discountId
        })

        return SuccessResponse(res, "Success", result)
    }

    @Get('shop')
    async getDiscountCodes(@RequestData('user') user: PayloadJwt, @Query() pagination: PaginationDto, @Res() res: Response) {
        const { page, limit } = pagination

        const result = await this.discountService.getAllDiscountCodesByShop({
            page,
            limit,
            shopId: user.userId,
        })

        return SuccessResponse(res, "Success", result)
    }

    @Get(':shop/:code')
    async getDiscountCodeByProduct(@Param('code') code: string, @Param('shop') shop: string, @Query() pagination: PaginationDto, @Res() res: Response) {
        const { page, limit } = pagination

        const result = await this.discountService.getAllDiscountCodeWithProduct({
            code,
            limit,
            page,
            shopId: shop
        })

        return SuccessResponse(res, "Success", result)
    }

    @Delete(':id')
    async deleteDiscountCode(@Param('id') discountId: string, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        await this.discountService.deleteDiscountCode(discountId, user.userId)

        return SuccessResponse(res, "Success")
    }
}