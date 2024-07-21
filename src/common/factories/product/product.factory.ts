import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Product } from "@modules/v1/product/entities/product.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { ProductRepositoryInterface } from "@modules/v1/product/interface/product.interface";


@Injectable()
export class ProductServiceFactory extends BaseServiceAbstract<Product> {
    constructor(
        @Inject('ProductRepositoryInterface')
        private readonly productRepository: ProductRepositoryInterface,
    ) {
        super(productRepository)
    }

    async createProduct(payload: Product) {
        return await this.productRepository.create(payload)
    }

    async updateProduct(productId: Types.ObjectId, shopId: Types.ObjectId, payload: Product) {
        return await this.productRepository.findOneAndUpdate({
            _id: productId,
            product_shop: shopId
        }, payload, {
            new: true,
            projection: {
                __v: 0,
                deleted_at: 0
            }
        })
    }
}
