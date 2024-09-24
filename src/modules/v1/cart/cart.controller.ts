import { Response } from "express";
import { Body, Controller, Delete, Get, Param, Post, Put, Res } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import { CreateCartDto, UpdateCartDto } from "./dto/cart.dto";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { SuccessResponse } from "@common/core/success.response";

@ApiTags('Cart')
@Controller({ version: ApiVersionEnum.V1 })
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) { }

    @Get()
    async getCart(@RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const result = await this.cartService.getListUserCart(user.userId)

        return SuccessResponse(res, 'Successfully get cart', result)
    }

    @Post()
    async addToCart(@Body() payload: CreateCartDto, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const result = await this.cartService.addToCart(user.userId, payload)

        return SuccessResponse(res, 'Successfully added to cart', result)
    }

    @Put()
    async updateCart(@Body() payload: UpdateCartDto, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const result = await this.cartService.addToCartV2(user.userId, payload.shop_order_ids)

        return SuccessResponse(res, 'Successfully updated cart', result)
    }

    @Delete(':id')
    @ApiParam({
        name: 'id',
        type: 'string',
        required: true,
        description: 'Product ID'
    })
    @ApiOperation({ summary: 'Delete item cart' })
    async deleteCart(@RequestData('user') user: PayloadJwt, @Res() res: Response, @Param('id') productId: string) {
        await this.cartService.deleteItemCart(user.userId, productId)

        return SuccessResponse(res, 'Successfully deleted cart')
    }
}