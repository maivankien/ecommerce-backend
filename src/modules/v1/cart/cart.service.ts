import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { Cart, CartProduct } from "./entities/cart.entity";
import { CartRepositoryInterface } from "./interfaces/cart.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { CartStateEnum } from "@common/enums/cart.enum";
import { ProductService } from "../product/services/product.service";
import { convertToObjectId } from "@common/utils/common.util";
import { UpdateCartItemDto } from "./dto/cart.dto";


@Injectable()
export class CartService extends BaseServiceAbstract<Cart> {
    constructor(
        @Inject('CartRepositoryInterface')
        private readonly cartRepository: CartRepositoryInterface,

        private readonly productService: ProductService,
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


    async addToCartV2(userId: string, shopOrderIds: UpdateCartItemDto[]) {
        const { product_id, product_quantity, product_old_quantity } = shopOrderIds[0].item_products[0]

        const productData = await this.productService.findOneByCondition({ _id: convertToObjectId(product_id) })

        if (!productData) {
            throw new NotFoundException('Product not found.')
        }

        if (productData.product_shop.toString() !== shopOrderIds[0]?.shop_id) {
            throw new NotFoundException('Product do not belong to the shop.')
        }

        if (product_quantity === 0) {
            return await this.deleteItemCart(userId, product_id)
        }

        return await this.updateUserCartQuantity(userId, {
            product_id,
            product_quantity: product_quantity - product_old_quantity
        })
    }


    async deleteItemCart(userId: string, productId: string) {
        const query = {
            cart_user_id: userId,
            cart_state: CartStateEnum.ACTIVE
        }

        const update = {
            $pull: { cart_products: { product_id: productId } }
        }

        return await this.cartRepository.findOneAndUpdate(query, update, {
            projection: { cart_products: 1 }
        })
    }

    async getListUserCart(userId: string) {
        return await this.cartRepository.findOneByCondition({ cart_user_id: userId })
    }
}