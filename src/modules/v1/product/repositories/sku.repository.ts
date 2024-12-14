import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSku, ProductSkuDocument } from "../entities/sku.entity";
import { ProductSkuRepositoryInterface } from "../interface/sku.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class ProductSkuRepository
    extends BaseRepositoryAbstract<ProductSku>
    implements ProductSkuRepositoryInterface {
    constructor(
        @InjectModel(ProductSku.name)
        private readonly productSkuModel: Model<ProductSkuDocument>
    ) {
        super(productSkuModel)
    }
}