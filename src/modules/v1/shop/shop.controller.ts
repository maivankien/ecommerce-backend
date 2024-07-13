import { ApiTags } from "@nestjs/swagger";
import { ShopService } from "./shop.service";
import { SignUpShopDto } from "./dtos/shop.dto";
import { Body, Controller, Get, Post } from "@nestjs/common";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { Shop } from "./entities/shop.entity";


@ApiTags('Shop')
@Controller({ version: ApiVersionEnum.V1 })
export class ShopController {
    constructor(
        private readonly shopService: ShopService
    ) { }

    @Post('signup')
    public async signup(@Body() input: SignUpShopDto) {
        return await this.shopService.createShop(input as Shop)
    }
}