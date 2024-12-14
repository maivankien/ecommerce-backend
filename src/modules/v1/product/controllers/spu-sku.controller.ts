import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { Body, Controller, Get, Post, Query, Res } from "@nestjs/common";
import { ProductSpuService } from "../services/spu.service";
import { CreateProductSpuDto } from "../dtos/spu.dto";
import { CreatedResponse, SuccessResponse } from "@common/core/success.response";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { ProductSkuService } from "../services/sku.service";


@ApiTags('Product Spu-Sku')
@Controller({
    path: 'spu-sku',
    version: ApiVersionEnum.V1
})
export class ProductSpuSkuController {
    constructor(
        private readonly productSpuService: ProductSpuService,
        private readonly productSkuService: ProductSkuService
    ) { }


    @Post('create')
    async createProductSpu(@Res() res: Response, @Body() payload: CreateProductSpuDto, @RequestData('user') user: PayloadJwt) {
        const shopId = user.userId

        await this.productSpuService.createProductSpu(shopId, payload)

        return CreatedResponse(res, "Success create product spu")
    }

    @Get('select')
    async getSpuBySpuId(@Res() res: Response, @Query('product_id') productId: string) {
        const spu = await this.productSpuService.getSpuByProductId(productId)

        return SuccessResponse(res, "Success get product spu", spu)
    }

    @Get('sku/list')
    async getListSkuByProductId(@Res() res: Response, @Query('product_id') productId: string) {
        const sku = await this.productSkuService.getListSkuByProductId(productId)

        return SuccessResponse(res, "Success get list sku", sku)
    }

    @Get('select-variation')
    async getSkuBySkuIdAndProductId(@Res() res: Response, @Query('sku_id') skuId: string, @Query('product_id') productId: string) {
        const sku = await this.productSkuService.getSkuBySkuIdAndProductId(skuId, productId)

        return SuccessResponse(res, "Success get sku", sku)
    }
}
