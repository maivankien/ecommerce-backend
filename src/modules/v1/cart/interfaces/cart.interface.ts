import { Cart } from "../entities/cart.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type CartRepositoryInterface = BaseRepositoryInterface<Cart>