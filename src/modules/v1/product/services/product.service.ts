import { Product } from "../entities/product.entity";
import { BadRequestException, Injectable } from "@nestjs/common";
import { ProductTypeFactory } from "../interface/product-type.interface";


@Injectable()
export class ProductService {
    private productRegistry = new Map<string, ProductTypeFactory>()

    registerProductType(type: string, service: ProductTypeFactory) {
        this.productRegistry.set(type, service)
    }

    async createProductService(type: string, payload: Product) {
        const productClass = this.productRegistry.get(type)

        if (!productClass) {
            throw new BadRequestException(`Product type \`${type}\` not found.`)
        }

        return await productClass.createProduct(payload)
    }
}

