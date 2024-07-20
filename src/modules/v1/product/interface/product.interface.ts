import { Product } from "../entities/product.entity";
import { BaseRepositoryInterface } from "@common/mongo/base/repositories/base.interface.repository";


export type ProductRepositoryInterface = BaseRepositoryInterface<Product>