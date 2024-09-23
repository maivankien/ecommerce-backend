import { Controller, Get } from "@nestjs/common";
import { CartService } from "./cart.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ApiTags } from "@nestjs/swagger";


@ApiTags('Cart')
@Controller({ version: ApiVersionEnum.V1 })
export class CartController {
    constructor(
        private readonly cartService: CartService
    ) {}

    @Get()
    async getCart() {
        return "Cart"
    }
}