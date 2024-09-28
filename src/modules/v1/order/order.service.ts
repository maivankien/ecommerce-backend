import { Order } from "./entities/order.entity";
import { CartService } from "../cart/cart.service";
import { CheckoutOrderSto, CheckoutReviewDto } from "./dto/order.dto";
import { CartStateEnum } from "@common/enums/cart.enum";
import { convertToObjectId } from "@common/utils/common.util";
import { DiscountService } from "../discount/discount.service";
import { RedisOrderService } from "./services/redis.service";
import { ProductService } from "../product/services/product.service";
import { OrderRepositoryInterface } from "./interfaces/order.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class OrderService extends BaseServiceAbstract<Order> {
    constructor(
        private readonly cartService: CartService,
        private readonly productService: ProductService,
        private readonly discountService: DiscountService,
        private readonly redisOrderService: RedisOrderService,

        @Inject('OrderRepositoryInterface')
        private readonly orderRepository: OrderRepositoryInterface,
    ) {
        super(orderRepository)
    }

    async checkProductByServer(itemProducts: { product_id: string, product_quantity: number }[]) {
        return await Promise.all(itemProducts.map(async item => {
            const { product_id, product_quantity } = item

            const product = await this.productService.findOneByCondition(
                { _id: convertToObjectId(product_id) },
                { product_price: 1 }
            )

            if (product) {
                return {
                    product_id: product_id,
                    product_price: product.product_price,
                    product_quantity: product_quantity,
                }
            }
        }))
    }

    async checkoutReview(userId: string, payload: CheckoutReviewDto) {
        const { cart_id: cartId, shop_order_ids: shopOrderIds } = payload
        const cart = await this.cartService.findOneByCondition({ _id: convertToObjectId(cartId), cart_user_id: userId, cart_state: CartStateEnum.ACTIVE })

        if (!cart) {
            throw new NotFoundException('Cart not found!')
        }

        const shopOrderIdsNew = [], checkoutOrder = {
            feeShip: 0,
            totalPrice: 0, // total price of all items in cart
            totalDiscount: 0,
            totalCheckout: 0,
        }

        for (const shopOrderId of shopOrderIds) {
            const { shop_id, shop_discounts = [], item_products = [] } = shopOrderId

            const checkProductServer = await this.checkProductByServer(item_products)

            if (!checkProductServer[0]) {
                throw new BadRequestException('Order invalid!')
            }

            const checkoutPrice = checkProductServer.reduce((acc, item) => {
                const { product_price, product_quantity } = item
                return acc + (product_price * product_quantity)
            }, 0)

            // Total before
            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckOut = {
                shopId: shop_id,
                shopDiscounts: shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                itemProducts: checkProductServer,
            }

            if (shop_discounts.length) {
                const { discount = 0 } = await this.discountService.getDiscountAmount({
                    userId: userId,
                    shopId: shop_id,
                    products: checkProductServer,
                    codeId: shop_discounts[0].discount_code,
                })

                checkoutOrder.totalDiscount += discount

                if (discount > 0) {
                    itemCheckOut.priceApplyDiscount = checkoutPrice - discount
                }
            }

            shopOrderIdsNew.push(itemCheckOut)
            checkoutOrder.totalCheckout += itemCheckOut.priceApplyDiscount
        }

        return {
            shopOrderIds,
            shopOrderIdsNew,
            checkoutOrder,
        }
    }

    async orderByUser(userId: string, payload: CheckoutOrderSto) {
        const { shopOrderIdsNew, checkoutOrder } = await this.checkoutReview(userId, payload)

        const products = shopOrderIdsNew.flatMap(order => order.itemProducts)

        const cartId = payload.cart_id
        const acquireProducts: boolean[] = []

        for (const product of products) {
            const { product_id, product_quantity } = product
            const keyLock = await this.redisOrderService.acquireLock(cartId, product_id, product_quantity)

            acquireProducts.push(!!keyLock)

            if (keyLock) {
                await this.redisOrderService.releaseLock(keyLock)
            }
        }

        if (acquireProducts.includes(false)) {
            throw new BadRequestException('Some products have been updated, please return to cart...')
        }

        const { user_address, user_payment } = payload

        const newOrder = await this.orderRepository.create({
            order_user_id: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shopOrderIdsNew
        } as Order)


        if (newOrder) {
            // Remove product from cart
        }

        return {
            shopOrderIdsNew,
            checkoutOrder,
        }
    }


    async getOrdersByUser(userId: string) {
        // 
    }

    async getOrderDetail(userId: string, orderId: string) {
        // 
    }

    async cancelOrder(userId: string, orderId: string) {
        //
    }


    /**
     *  Update Order Status [Shop | Admin]
     */
    async updateOrderStatusByShop(shopId: string, orderId: string) {
        //
    }
}