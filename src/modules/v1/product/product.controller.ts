import { Types } from "mongoose";
import { Response } from "express";
import { ApiTags } from "@nestjs/swagger";
import { Product } from "./entities/product.entity";
import { CreateProductDto } from "./dtos/create.dto";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ProductService } from "./services/product.service";
import { PaginationDto } from "@common/dtos/pagination.dto";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { DEFAULT_LIMIT, DEFAULT_PAGE } from "@common/constants/common.constants";
import { CreatedResponse, SuccessResponse } from "@common/core/success.response";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { Body, Controller, Get, Param, Post, Put, Query, Res } from "@nestjs/common";


@ApiTags('Product')
@Controller({ version: ApiVersionEnum.V1 })
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Get('')
    async getAllProducts(@Query() { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE }: PaginationDto, @Res() res: Response) {
        const skip = (page - 1) * limit
        const products = await this.productService.findAllProducts({}, ['product_name', 'product_price', 'product_thumb'], 'ctime', limit, skip)

        return SuccessResponse(res, "Success", products)
    }


    @Get(':id')
    async getProductById(@Param('id') id: string, @Res() res: Response) {
        return SuccessResponse(res, "Success", await this.productService.findProduct(id, ["__v", "deleted_at"]))
    }


    @Post('create')
    async createProduct(@Body() productDto: CreateProductDto, @RequestData('user') user: PayloadJwt, @Res() res: Response) {
        const { product_type } = productDto

        const result = await this.productService.createProductService(product_type, {
            ...productDto,
            product_shop: new Types.ObjectId(user.userId)
        } as Product)

        return CreatedResponse(res, "Success", result)
    }


    @Get('search')
    async searchProduct(@Query() pagination: PaginationDto, @Res() res: Response, @Query('query') query: string) {
        const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = pagination
        const skip = (page - 1) * limit

        return SuccessResponse(res, "Success", await this.productService.searchProduct(query, limit, skip))
    }


    @Get('drafts')
    async getAllDraftsForShop(@RequestData('user') user: PayloadJwt, @Query() pagination: PaginationDto, @Res() res: Response) {
        const { userId } = user
        const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = pagination

        const skip = (page - 1) * limit

        return SuccessResponse(res, "Success", await this.productService.findAllDraftsForShop(userId, limit, skip))
    }


    @Get('publish')
    async getAllPublishedProducts(@RequestData('user') user: PayloadJwt, @Query() pagination: PaginationDto, @Res() res: Response) {
        const { userId } = user
        const { limit = DEFAULT_LIMIT, page = DEFAULT_PAGE } = pagination

        const skip = (page - 1) * limit

        return SuccessResponse(res, "Success", await this.productService.findAllPublishedProduct(userId, limit, skip))
    }


    @Put('publish/:id')
    async publishProduct(@RequestData('user') user: PayloadJwt, @Param('id') id: string, @Res() res: Response) {
        const { userId } = user
        await this.productService.publishProductByShop(userId, id)

        return SuccessResponse(res, "Success")
    }


    @Put('unpublish/:id')
    async unpublishProduct(@RequestData('user') user: PayloadJwt, @Param('id') id: string, @Res() res: Response) {
        const { userId } = user
        await this.productService.unPublishProductByShop(userId, id)

        return SuccessResponse(res, "Success")
    }
}
