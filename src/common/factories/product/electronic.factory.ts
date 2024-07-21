import slugify from "slugify";
import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { ProductServiceFactory } from "./product.factory";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Electronics } from "@modules/v1/product/entities/product-type.entity";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { removeAttrUndefined, updateNestedObjectParser } from "@common/utils/common.util";
import { ElectronicsRepositoryInterface } from "@modules/v1/product/interface/product-type.interface";


@Injectable()
export class ElectronicsServiceFactory extends BaseServiceAbstract<Electronics> {
    constructor(
        @Inject('ElectronicsRepositoryInterface')
        private readonly electronicsRepository: ElectronicsRepositoryInterface,

        private readonly productServiceFactory: ProductServiceFactory
    ) {
        super(electronicsRepository)
    }

    async createProduct(payload: Product) {
        const newElectronics = await this.electronicsRepository.create({
            ...payload.product_attributes,
            product_shop: payload.product_shop
        } as Electronics)

        return await this.productServiceFactory.createProduct({
            ...payload,
            _id: newElectronics._id,
        })
    }

    async updateProduct(shopId: Types.ObjectId, productId: Types.ObjectId, payload: Product) {
        const objectParams = removeAttrUndefined(payload)

        if (objectParams?.product_attributes) {
            await this.electronicsRepository.findOneAndUpdate({
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