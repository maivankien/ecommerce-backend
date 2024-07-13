import { ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { SignUpShopDto } from "./dtos/shop.dto";
import { Body, Controller, Get, Post, Res } from "@nestjs/common";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { Shop } from "./entities/shop.entity";
import { CreatedResponse } from "@common/core/success.response";
import { Response } from "express";

@ApiTags('Shop')
@Controller({ version: ApiVersionEnum.V1 })
export class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) { }

    @Post('signup')
    public async signup(@Body() input: SignUpShopDto, @Res() res: Response) {
        const shop = await this.shopService.createShop(input as Shop)

        return CreatedResponse(res, "Success", shop)
    }
}