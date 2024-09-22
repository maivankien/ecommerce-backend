import { Discount } from "./entities/discount.entity";
import { convertToObjectId, removeAttrUndefined } from "@common/utils/common.util";
import { DiscountAppliesToEnum, DiscountTypeEnum } from "@common/enums/product.enum";
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
            value, max_value, max_users, users_count, max_uses_per_user, max_order_value
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
            _id: 1,
            discount_is_active: 1
        })

        if (foundDiscount?.discount_is_active) {
            throw new BadRequestException('Discount code already exists')
        }

        return await this.discountRepository.create({
            discount_name: name,
            discount_type: type,
            discount_code: code,
            discount_value: value,
            discount_max_uses: max_users,
            discount_is_active: is_active,
            discount_max_value: max_value,
            discount_applies_to: applies_to,
            discount_users_used: users_used,
            discount_description: description,
            discount_uses_count: users_count,
            discount_end_date: discountEndDate,
            discount_start_date: discountStartDate,
            discount_shop_id: convertToObjectId(shop_id),
            discount_min_order_value: min_order_value || 0,
            discount_max_order_value: max_order_value || 0,
            discount_max_uses_per_user: max_uses_per_user,
            discount_product_ids: applies_to === DiscountAppliesToEnum.ALL ? [] : product_ids
        } as Discount)
    }

    async updateDiscountCode(payload): Promise<Discount> {
        const {
            code, start_date, end_date, is_active, shop_id, min_order_value,
            product_ids, applies_to, name, description, type, users_used, discount_id,
            value, max_value, max_users, users_count, max_uses_per_user, max_order_value
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
            _id: convertToObjectId(discount_id),
            discount_shop_id: convertToObjectId(shop_id)
        }, {
            projection: {
                _id: 1,
            }
        })

        if (!foundDiscount) {
            throw new BadRequestException('Discount code not found')
        }

        const updateDate = removeAttrUndefined({
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
            discount_min_order_value: min_order_value,
            discount_max_order_value: max_order_value,
            discount_max_uses_per_user: max_uses_per_user,
            discount_product_ids: applies_to === DiscountAppliesToEnum.ALL ? [] : product_ids
        }) as Discount

        return await this.discountRepository.findOneAndUpdate({
            discount_code: code,
            discount_shop_id: convertToObjectId(shop_id)
        }, updateDate)
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
            _id: 1,
            discount_is_active: 1,
            discount_applies_to: 1,
            discount_product_ids: 1
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

    async getDiscountAmount({
        codeId,
        userId,
        shopId,
        products
    }) {
        const foundDiscount = await this.discountRepository.findOneByCondition({
            discount_code: codeId,
            discount_shop_id: convertToObjectId(shopId),
        }, {
            _id: 1,
            discount_code: 1,
            discount_value: 1,
            discount_type: 1,
            discount_max_uses: 1,
            discount_end_date: 1,
            discount_max_value: 1,
            discount_is_active: 1,
            discount_uses_count: 1,
            discount_start_date: 1,
            discount_users_used: 1,
            discount_applies_to: 1,
            discount_product_ids: 1,
            discount_max_order_value: 1,
            discount_min_order_value: 1,
            discount_max_uses_per_user: 1,
        })

        if (!foundDiscount) {
            throw new NotFoundException('Discount code not found')
        }

        const {
            discount_value,
            discount_type,
            discount_is_active,
            discount_max_uses,
            discount_start_date,
            discount_end_date,
            discount_users_used,
            discount_min_order_value,
            discount_max_order_value,
        } = foundDiscount

        if (!discount_is_active) {
            throw new BadRequestException('Discount code is inactive')
        }

        if (discount_max_uses <= 0) {
            throw new BadRequestException('Discount code has reached max uses')
        }

        const dateNow = new Date()
        if (dateNow < new Date(discount_start_date) || dateNow > new Date(discount_end_date)) {
            throw new BadRequestException('Discount code is not yet active')
        }

        // Check if discount applies to all prices
        const totalOrder = products.reduce((acc: number, product: Product) => {
            return acc + (product.product_price * product.product_quantity)
        }, 0)

        if (discount_min_order_value > 0 && totalOrder < discount_min_order_value) {
            throw new BadRequestException('Discount requires minimum order value of ' + discount_min_order_value)
        }

        if (discount_max_order_value > 0) {
            const userDiscount = discount_users_used.find((user) => user === userId)

            // Check if user has used discount code (Logic for max uses per user)
            if (userDiscount) {
                throw new BadRequestException('Discount code has already been used by user')
            }
        }

        const amount = discount_type === DiscountTypeEnum.FIXED_AMOUNT ? discount_value : (totalOrder * (discount_value / 100))

        return {
            totalOrder,
            discount: amount,
            totalPrice: totalOrder - amount
        }
    }

    async deleteDiscountCode(shopId: string, discountId: string) {
        const deleteDiscount = await this.discountRepository.findOneAndUpdate(
            { _id: convertToObjectId(discountId), discount_shop_id: convertToObjectId(shopId) },
            { deleted_at: new Date() },
            { new: true, projection: { deleted_at: 1 } }
        )

        if (!deleteDiscount) {
            throw new NotFoundException('Discount code not found')
        }

        return !!(deleteDiscount.deleted_at)
    }


    async cancelDiscountCode(shopId: string, codeId: string, userId: string) {
        const foundDiscount = await this.discountRepository.findOneByCondition({
            discount_code: convertToObjectId(codeId),
            discount_shop_id: convertToObjectId(shopId),
        }, {
            projection: {
                _id: 1,
            }
        })

        if (!foundDiscount) {
            throw new NotFoundException('Discount code not found')
        }

        const discountId = foundDiscount._id.toString()

        const result = await this.discountRepository.update(discountId, {
            $pull: {
                discount_users_used: userId
            },
            $inc: {
                discount_max_uses: 1,
                discount_users_count: -1
            }
        })

        return result
    }
}