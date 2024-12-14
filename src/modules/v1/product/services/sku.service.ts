import { Inject } from "@nestjs/common";
import { ProductSku } from "../entities/sku.entity";
import { ProductSkuRepositoryInterface } from "../interface/sku.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { randomProductId } from "@common/utils/common.util";


export class ProductSkuService extends BaseServiceAbstract<ProductSku> {
    constructor(
        @Inject('ProductSkuRepositoryInterface')
        private readonly productSkuRepository: ProductSkuRepositoryInterface
    ) {
        super(productSkuRepository)
    }


    async createProductSku(spuId: string, skuList: any[]) {
        const convertSkus = skuList.map(sku => {
            return {
                ...sku,
                product_id: spuId,
                sku_id: `${spuId}.${randomProductId()}`
            }
        }) as ProductSku[]

        return await this.productSkuRepository.createMany(convertSkus)
    }

    async getSkuBySkuIdAndProductId(skuId: string, productId: string) {
        // Read cache

        const queries = { sku_id: skuId, product_id: productId }
        const projection = { deleted_at: 0, __v: 0, created_at: 0, updated_at: 0 }
        const sku = await this.productSkuRepository.findOne(queries, projection)

        if (sku) {
            // Set cache
        }

        return sku
    }

    async getListSkuByProductId(productId: string) {
        const queries = { product_id: productId }
        const projection = { deleted_at: 0, __v: 0, created_at: 0, updated_at: 0 }
        return await this.productSkuRepository.find(queries, projection)
    }
}