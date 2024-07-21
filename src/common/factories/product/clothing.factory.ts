import slugify from "slugify";
import { Inject, Injectable } from "@nestjs/common";
import { ProductServiceFactory } from "./product.factory";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Clothing } from "@modules/v1/product/entities/product-type.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { removeAttrUndefined, updateNestedObjectParser } from "@common/utils/common.util";
import { ClothingRepositoryInterface } from "@modules/v1/product/interface/product-type.interface";
import { Types } from "mongoose";


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

    async updateProduct(shopId: Types.ObjectId, productId: Types.ObjectId, payload: Product) {
        const objectParams = removeAttrUndefined(payload)

        if (objectParams?.product_attributes) {
            await this.clothingRepository.findOneAndUpdate({
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