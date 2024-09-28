import { Response } from "express";
import { Body, Controller, Post, Res } from "@nestjs/common";
import { InventoryService } from "../services/inventory.service";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ApiTags } from "@nestjs/swagger";
import { SuccessResponse } from "@common/core/success.response";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { AddStockDto } from "../dtos/inventory.dto";
import { RequestData } from "@common/decorators/requests/request-data.decorator";


@ApiTags('Inventory')
@Controller({
    path: 'inventory',
    version: ApiVersionEnum.V1
})
export class InventoryController {
    constructor(
        private readonly inventoryService: InventoryService,
    ) {}

    @Post('add-stock')
    async addStockToInventory(@Body() payload: AddStockDto, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const { product_id, stock, location } = payload

        const result = await this.inventoryService.addStockToInventory(user.userId, product_id, stock, location)

        return SuccessResponse(res, "Success", result)
    }
}