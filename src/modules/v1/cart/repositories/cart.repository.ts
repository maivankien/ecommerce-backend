import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Cart, CartDocument } from "../entities/cart.entity";
import { CartRepositoryInterface } from "../interfaces/cart.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class CartRepository
    extends BaseRepositoryAbstract<Cart>
    implements CartRepositoryInterface {
    constructor(
        @InjectModel(Cart.name)
        private readonly cartModel: Model<CartDocument>
    ) {
        super(cartModel)
    }
}