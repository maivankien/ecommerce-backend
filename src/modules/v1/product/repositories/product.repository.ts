import { Model } from "mongoose";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Product, ProductDocument } from "../entities/product.entity";
import { ProductRepositoryInterface } from "../interface/product.interface";
import { BaseRepositoryAbstract } from "@common/mongo/base/repositories/base.abstract.repository";


@Injectable()
export class ProductRepository
    extends BaseRepositoryAbstract<Product>
    implements ProductRepositoryInterface {
    constructor(
        @InjectModel(Product.name)
        private readonly productModel: Model<ProductDocument>
    ) {
        super(productModel)
    }
}