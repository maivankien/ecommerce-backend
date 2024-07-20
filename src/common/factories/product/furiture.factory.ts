import { Inject, Injectable } from "@nestjs/common";
import { ProductServiceFactory } from "./product.factory";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Furnitures } from "@modules/v1/product/entities/product-type.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { FurnituresRepositoryInterface } from "@modules/v1/product/interface/product-type.interface";


@Injectable()
export class FurnituresServiceFactory extends BaseServiceAbstract<Furnitures> {
    constructor(
        @Inject('FurnituresRepositoryInterface')
        private readonly furnituresRepository: FurnituresRepositoryInterface,

        private readonly productServiceFactory: ProductServiceFactory
    ) {
        super(furnituresRepository)
    }

    async createProduct(payload: Product) {
        const newFurnitures = await this.furnituresRepository.create({
            ...payload.product_attributes,
            product_shop: payload.product_shop
        } as Furnitures)

        return await this.productServiceFactory.createProduct({
            ...payload,
            _id: newFurnitures._id,
        })
    }
}