import { Inject, NotFoundException } from "@nestjs/common";
import { ProductSpu } from "../entities/spu.entity";
import { ProductSpuRepositoryInterface } from "../interface/spu.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { CreateProductSpuDto } from "../dtos/spu.dto";
import { ShopService } from "@modules/v1/shop/shop.service";
import { convertToObjectId, randomProductId } from "@common/utils/common.util";
import { ProductSkuService } from "./sku.service";


export class ProductSpuService extends BaseServiceAbstract<ProductSpu> {
    constructor(
        @Inject('ProductSpuRepositoryInterface')
        private readonly productSpuRepository: ProductSpuRepositoryInterface,

        private readonly shopService: ShopService,
        private readonly productSkuService: ProductSkuService
    ) {
        super(productSpuRepository)
    }


    async createProductSpu(shopId: string, payload: CreateProductSpuDto) {
        const shop = await this.shopService.getShopById(shopId, ['_id'])

        if (!shop) {
            throw new NotFoundException('Shop not found')
        }

        // Create a new product spu
        const spu = await this.productSpuRepository.create({
            product_id: randomProductId(),
            product_name: payload.name,
            product_thumb: payload.thumb,
            product_price: payload.price,
            product_category: payload.category,
            product_quantity: payload.quantity,
            product_attributes: payload.attributes,
            product_variations: payload.variations,
            product_description: payload.description,
            product_shop: convertToObjectId(shopId),
        } as ProductSpu)

        const skuList = payload.sku_list
        if (spu && skuList?.length) {
            // Create sku list
            await this.productSkuService.createProductSku(spu.product_id, skuList)
        }
    }

    async getSpuByProductId(productId: string) {
        const queries = { product_id: productId }
        const projection = { deleted_at: 0, __v: 0, created_at: 0, updated_at: 0 }
        const spu = await this.productSpuRepository.findOne(queries, projection)

        if (!spu) {
            throw new NotFoundException('Product spu not found')
        }

        const skus = await this.productSkuService.getListSkuByProductId(productId)

        return {
            spu_info: spu,
            sku_list: skus
        }
    }
}