import { Discount } from "../entities/discount.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";

export type DiscountRepositoryInterface = BaseRepositoryInterface<Discount>