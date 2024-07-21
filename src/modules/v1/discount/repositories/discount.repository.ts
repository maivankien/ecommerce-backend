import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Discount, DiscountDocument } from "../entities/discount.entity";
import { DiscountRepositoryInterface } from "../interfaces/discount.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class DiscountRepository
    extends BaseRepositoryAbstract<Discount>
    implements DiscountRepositoryInterface {
    constructor(
        @InjectModel(Discount.name)
        private readonly discountModel: Model<DiscountDocument>
    ) {
        super(discountModel)
    }
}