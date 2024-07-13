import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Shop, ShopDocument } from "./entities/shop.entity";
import { ShopRepositoryInterface } from "./interface/shop.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class ShopRepository
    extends BaseRepositoryAbstract<Shop>
    implements ShopRepositoryInterface {
    constructor(
        @InjectModel(Shop.name)
        private readonly shopModel: Model<ShopDocument>
    ) {
        super(shopModel)
    }
}