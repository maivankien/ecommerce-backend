import { Types } from "mongoose";
import { Inject, Injectable } from "@nestjs/common";
import { Product } from "@modules/v1/product/entities/product.entity";
import { Inventory } from "@modules/v1/product/entities/inventory.entity";
import { InventoryService } from "@modules/v1/product/services/inventory.service";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { ProductRepositoryInterface } from "@modules/v1/product/interface/product.interface";


@Injectable()
export class ProductServiceFactory extends BaseServiceAbstract<Product> {
    constructor(
        @Inject('ProductRepositoryInterface')
        private readonly productRepository: ProductRepositoryInterface,

        private readonly inventoryService: InventoryService
    ) {
        super(productRepository)
    }

    async createProduct(payload: Product) {
        const newProduct = await this.productRepository.create(payload)

        if (newProduct) {
            await this.inventoryService.create({
                inven_product_id: newProduct._id,
                inven_shop_id: newProduct.product_shop,
                inven_stock: newProduct.product_quantity,
            } as Inventory)
        }
        return newProduct
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
