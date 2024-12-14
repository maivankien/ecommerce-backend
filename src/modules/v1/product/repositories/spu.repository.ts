import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { ProductSpu, ProductSpuDocument } from "../entities/spu.entity";
import { ProductSpuRepositoryInterface } from "../interface/spu.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class ProductSpuRepository
    extends BaseRepositoryAbstract<ProductSpu>
    implements ProductSpuRepositoryInterface {
    constructor(
        @InjectModel(ProductSpu.name)
        private readonly productSpuModel: Model<ProductSpuDocument>
    ) {
        super(productSpuModel)
    }
}