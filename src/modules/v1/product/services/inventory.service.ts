import { Inventory } from "../entities/inventory.entity";
import { ProductService } from "./product.service";
import { convertToObjectId } from "@common/utils/common.util";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { InventoryRepositoryInterface } from "../interface/inventory.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class InventoryService extends BaseServiceAbstract<Inventory> {
    constructor(
        @Inject('InventoryRepositoryInterface')
        private readonly inventoryRepository: InventoryRepositoryInterface,

        private readonly productService: ProductService,
    ) {
        super(inventoryRepository)
    }

    async addStockToInventory(shopId: string, productId: string, stock, location: string) {
        const product = await this.productService.findOneByCondition({ _id: convertToObjectId(productId) }, { _id: 1 })

        if (!product) {
            throw new NotFoundException('Product not found!')
        }

        const query = {
            inven_shop_id: convertToObjectId(shopId),
            inven_product_id: convertToObjectId(productId),
        }
        const updateSet = {
            $inc: { inven_stock: stock },
            $set: { inven_location: location }
        }

        const options = { upsert: true, new: true }

        return await this.inventoryRepository.findOneAndUpdate(query, updateSet, options)
    }
}