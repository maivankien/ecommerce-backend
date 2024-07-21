import slugify from "slugify";
import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { ProductServiceFactory } from "./product.factory";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Furnitures } from "@modules/v1/product/entities/product-type.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { FurnituresRepositoryInterface } from "@modules/v1/product/interface/product-type.interface";
import { removeAttrUndefined, updateNestedObjectParser } from "@common/utils/common.util";


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

    async updateProduct(shopId: Types.ObjectId, productId: Types.ObjectId, payload: Product) {
        const objectParams = removeAttrUndefined(payload)

        if (objectParams?.product_attributes) {
            await this.furnituresRepository.findOneAndUpdate({
                _id: productId,
                product_shop: shopId
            }, updateNestedObjectParser(objectParams.product_attributes))
        }

        const valuesUpdate = updateNestedObjectParser(objectParams) as Product
        if (valuesUpdate.product_name) {
            valuesUpdate.product_slug = slugify(valuesUpdate.product_name, { lower: true })
        }

        return await this.productServiceFactory.updateProduct(productId, shopId, valuesUpdate)
    }
}