import { Inject, Injectable } from "@nestjs/common";
import { ProductServiceFactory } from "./product.factory";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Clothing } from "@modules/v1/product/entities/product-type.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { ClothingRepositoryInterface } from "@modules/v1/product/interface/product-type.interface";


@Injectable()
export class ClothingServiceFactory extends BaseServiceAbstract<Clothing> {
    constructor(
        @Inject('ClothingRepositoryInterface')
        private readonly clothingRepository: ClothingRepositoryInterface,

        private readonly productServiceFactory: ProductServiceFactory
    ) {
        super(clothingRepository)
    }

    async createProduct(payload: Product) {
        const newClothing = await this.clothingRepository.create({
            ...payload.product_attributes,
            product_shop: payload.product_shop
        } as Clothing)

        return await this.productServiceFactory.createProduct({
            ...payload,
            _id: newClothing._id,
        })
    }
}