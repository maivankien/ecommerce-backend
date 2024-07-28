import { Discount } from "./entities/discount.entity";
import { convertToObjectId } from "@common/utils/common.util";
import { DiscountAppliesToEnum } from "@common/enums/product.enum";
import { ProductService } from "../product/services/product.service";
import { DiscountRepositoryInterface } from "./interfaces/discount.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";
import { FilterQuery } from "mongoose";
import { Product } from "../product/entities/product.entity";


@Injectable()
export class DiscountService extends BaseServiceAbstract<Discount> {
    constructor(
        @Inject('DiscountRepositoryInterface')
        private readonly discountRepository: DiscountRepositoryInterface,

        private readonly productService: ProductService
    ) {
        super(discountRepository)
    }

    async createDiscountCode(payload): Promise<Discount> {
        const {
            code, start_date, end_date, is_active, shop_id, min_order_value,
            product_ids, applies_to, name, description, type, users_used,
            value, max_value, max_users, users_count, max_uses_per_user
        } = payload

        const timeNow = new Date()
        const discountEndDate = new Date(end_date)
        const discountStartDate = new Date(start_date)

        if (timeNow > discountStartDate || timeNow > discountEndDate) {
            throw new BadRequestException('Start date and end date must be in the future')
        }

        if (discountStartDate > discountEndDate) {
            throw new BadRequestException('Start date must be before end date')
        }

        const foundDiscount = await this.discountRepository.findOneByCondition({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        }, {
            projection: {
                _id: 1,
                discount_is_active: 1
            }
        })

        if (foundDiscount?.discount_is_active) {
            throw new BadRequestException('Discount code already exists')
        }

        return await this.discountRepository.create({
            discount_name: name,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_shop_id: shop_id,
            discount_max_uses: max_users,
            discount_is_active: is_active,
            discount_max_value: max_value,
            discount_applies_to: applies_to,
            discount_users_used: users_used,
            discount_description: description,
            discount_uses_count: users_count,
            discount_end_date: discountEndDate,
            discount_start_date: discountStartDate,
            discount_min_order_value: min_order_value || 0,
            discount_max_uses_per_user: max_uses_per_user,
            discount_product_ids: applies_to === DiscountAppliesToEnum.ALL ? [] : product_ids
        } as Discount)
    }

    async updateDiscountCode(payload): Promise<Discount> {
        const {
            code, start_date, end_date, is_active, shop_id, min_order_value,
            product_ids, applies_to, name, description, type, users_used,
            value, max_value, max_users, users_count, max_uses_per_user
        } = payload

        const timeNow = new Date()
        const discountEndDate = new Date(end_date)
        const discountStartDate = new Date(start_date)

        if (timeNow > discountStartDate || timeNow > discountEndDate) {
            throw new BadRequestException('Start date and end date must be in the future')
        }

        if (discountStartDate > discountEndDate) {
            throw new BadRequestException('Start date must be before end date')
        }

        const foundDiscount = await this.discountRepository.findOneByCondition({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        }, {
            projection: {
                _id: 1,
            }
        })

        if (!foundDiscount) {
            throw new BadRequestException('Discount code not found')
        }

        return await this.discountRepository.findOneAndUpdate({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        }, {
            discount_name: name,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_shop_id: shop_id,
            discount_max_uses: max_users,
            discount_is_active: is_active,
            discount_max_value: max_value,
            discount_applies_to: applies_to,
            discount_users_used: users_used,
            discount_description: description,
            discount_uses_count: users_count,
            discount_end_date: discountEndDate,
            discount_start_date: discountStartDate,
            discount_min_order_value: min_order_value || 0,
            discount_max_uses_per_user: max_uses_per_user,
            discount_product_ids: applies_to === DiscountAppliesToEnum.ALL ? [] : product_ids
        } as Discount)
    }

    async getAllDiscountCodeWithProduct({
        code,
        shopId,
        limit,
        page
    }): Promise<Product[]> {
        const foundDiscount = await this.discountRepository.findOneByCondition({
            discount_code: code,
            discount_shop_id: convertToObjectId(shopId)
        }, {
            projection: {
                _id: 1,
                discount_is_active: 1,
                discount_applies_to: 1,
                discount_product_ids: 1
            }
        })

        if (!foundDiscount?.discount_is_active) {
            throw new NotFoundException('Discount code not found')
        }

        let filter: FilterQuery<Product>
        const offset = (page - 1) * limit
        const { discount_applies_to, discount_product_ids } = foundDiscount

        if (discount_applies_to === DiscountAppliesToEnum.ALL) {
            filter = {
                product_shop: convertToObjectId(shopId)
            }
        }

        if (discount_applies_to === DiscountAppliesToEnum.SPECIFIC) {
            filter = {
                _id: { $in: discount_product_ids }
            }
        }

        return await this.productService.findAllProducts(filter, ['product_name'], 'ctime', limit, offset)
    }

    async getAllDiscountCodesByShop({
        shopId,
        limit,
        page,
        sort = 'ctime'
    }): Promise<Discount[]> {
        const offset = (page - 1) * limit
        const sortBy = sort === 'ctime' ? { _id: -1 } : { _id: 1 }

        const discounts = await this.discountRepository.findAll({
            discount_is_active: true,
            discount_shop_id: convertToObjectId(shopId)
        }, {
            limit,
            skip: offset,
            sort: sortBy,
            projection: {
                __v: 0,
                discount_shop_id: 0
            }
        })

        return discounts
    }
}