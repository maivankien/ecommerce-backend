import { ApiTags } from "@nestjs/swagger";
import { Body, Controller, Post } from "@nestjs/common";
import { DiscountService } from "./discount.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { CreateDiscountDto } from "./dtos/create.dto";
import { Discount } from "./entities/discount.entity";

@ApiTags('Discount')
@Controller({ version: ApiVersionEnum.V1 })
export class DiscountController {
    constructor(
        private readonly discountService: DiscountService
    ) { }

    @Post()
    async createDiscountCode(@Body() payload: CreateDiscountDto): Promise<Discount> {
        return await this.discountService.createDiscountCode(payload)
    }
}