import { Types } from "mongoose";
import { ApiTags } from "@nestjs/swagger";
import { CreateProductDto } from "./dtos/create.dto";
import { Body, Controller, Post } from "@nestjs/common";
import { ApiVersionEnum } from "@common/enums/common.enum";
import { ProductService } from "./services/product.service";
import { PayloadJwt } from "@common/interfaces/common.interface";
import { RequestData } from "@common/decorators/requests/request-data.decorator";
import { Product } from "./entities/product.entity";


@ApiTags('Product')
@Controller({ version: ApiVersionEnum.V1 })
export class ProductController {
    constructor(
        private readonly productService: ProductService
    ) { }

    @Post('create')
    async createProduct(@Body() productDto: CreateProductDto, @RequestData('user') user: PayloadJwt) {
        const { product_type } = productDto

        return await this.productService.createProductService(product_type, {
            ...productDto,
            product_shop: new Types.ObjectId(user.userId)
        } as Product)
    }
}
