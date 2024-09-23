import { Inject, Injectable } from "@nestjs/common";
import { Cart, CartProduct } from "./entities/cart.entity";
import { CartRepositoryInterface } from "./interfaces/cart.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { CartStateEnum } from "@common/enums/cart.enum";


@Injectable()
export class CartService extends BaseServiceAbstract<Cart> {
    constructor(
        @Inject('CartRepositoryInterface')
        private readonly cartRepository: CartRepositoryInterface
    ) {
        super(cartRepository)
    }

    private async createUserCart(userId: string, product: CartProduct) {
        const query = {
            cart_user_id: userId,
            cart_state: CartStateEnum.ACTIVE
        }

        const updateOrInsert = {
            $addToSet: { cart_products: product }
        }
        const options = { new: true, upsert: true }

        return await this.cartRepository.findOneAndUpdate(query, updateOrInsert, options)
    }

    private async updateUserCartQuantity(userId: string, product: CartProduct) {
        const { product_id, product_quantity } = product
        
        const query = {
            "cart_user_id": userId,
            "cart_state": CartStateEnum.ACTIVE,
            "cart_products.product_id": product_id
        }
        const updateSet = {
            $inc: { "cart_products.$.product_quantity": product_quantity }
        }
        const options = { new: true, upsert: true }

        return await this.cartRepository.findOneAndUpdate(query, updateSet, options)
    }

    async addToCart(userId: string, product: CartProduct) {
        const cart = await this.cartRepository.findOneByCondition({ cart_user_id: userId })

        if (!cart) {
            return await this.createUserCart(userId, product)
        }

        if (!cart.cart_products.length) {
            cart.cart_products.push(product)

            return await this.cartRepository.update(cart._id.toString(), cart)
        }

        return await this.updateUserCartQuantity(userId, product)
    }
}