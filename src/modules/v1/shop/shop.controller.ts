import { ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { LoginShopDto, SignUpShopDto } from "./dtos/shop.dto";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { Shop } from "./entities/shop.entity";
import { CreatedResponse, SuccessResponse } from "@common/core/success.response";
import { Response } from "express";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { KeyToken } from "../auth/entities/keytoken.entity";
import { KeyTokenService } from "../auth/services/keytoken.service";
import { PayloadJwt } from "@common/interfaces/common.interface";

@ApiTags('Shop')
@Controller({ version: ApiVersionEnum.V1 })
export class ShopController {
    constructor(
        private readonly shopService: ShopService,

        private readonly keyTokenService: KeyTokenService
    ) { }

    @Post('signup')
    public async signup(@Body() input: SignUpShopDto, @Res() res: Response) {
        const shop = await this.shopService.createShop(input as Shop)

        return CreatedResponse(res, "Success", shop)
    }

    @Post('login')
    public async login(@Body() input: LoginShopDto, @Res() res: Response) {
        return SuccessResponse(res, "Success", await this.shopService.loginShop(input))
    }

    @Post('logout')
    public async logout(@RequestData('keyStore') keyStore: KeyToken, @Res() res: Response) {
        await this.keyTokenService.remove((keyStore._id).toString())
        return SuccessResponse(res, "Success")
    }

    @Post('refresh-token')
    public async refreshToken(
        @Res() res: Response,
        @RequestData('user') user: PayloadJwt,
        @RequestData('keyStore') keyStore: KeyToken,
        @RequestData('refreshToken') refreshToken: string,
    ) {
        return SuccessResponse(res, "Success", await this.shopService.handleRefreshToken({ refreshToken, user, keyStore }))
    }
}