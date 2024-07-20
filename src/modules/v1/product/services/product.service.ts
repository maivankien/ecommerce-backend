import { Types } from "mongoose";
import { Product } from "../entities/product.entity";
import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { ProductTypeFactory } from "../interface/product-type.interface";
import { ProductRepositoryInterface } from "../interface/product.interface";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";


@Injectable()
export class ProductService extends BaseServiceAbstract<Product> {
    constructor(
        @Inject('ProductRepositoryInterface')
        private readonly productRepository: ProductRepositoryInterface,
    ) {
        super(productRepository)
    }

    private productRegistry = new Map<string, ProductTypeFactory>()

    registerProductType(type: string, service: ProductTypeFactory) {
        this.productRegistry.set(type, service)
    }

    static queryOptionsProduct(limit: number, skip: number) {
        return {
            limit: limit,
            skip: skip,
            populate: {
                path: "product_shop",
                select: "name email -_id"
            },
            projection: {
                __v: 0,
                deleted_at: 0
            }
        }
    }

    async createProductService(type: string, payload: Product) {
        const productClass = this.productRegistry.get(type)

        if (!productClass) {
            throw new BadRequestException(`Product type \`${type}\` not found.`)
        }

        return await productClass.createProduct(payload)
    }

    async findAllDraftsForShop(product_shop: string, limit: number, skip: number) {
        return await this.productRepository.findAll({
            isDraft: true,
            product_shop: new Types.ObjectId(product_shop),
        }, ProductService.queryOptionsProduct(limit, skip))
    }

    async publishProductByShop(product_shop: string, product_id: string) {
        const update = await this.productRepository.findOneAndUpdate({
            _id: new Types.ObjectId(product_id),
            product_shop: new Types.ObjectId(product_shop)
        }, {
            isDraft: false,
            isPublished: true
        })

        if (!update) {
            throw new BadRequestException("Product not found.")
        }
    }

    async unPublishProductByShop(product_shop: string, product_id: string) {
        const update = await this.productRepository.findOneAndUpdate({
            _id: new Types.ObjectId(product_id),
            product_shop: new Types.ObjectId(product_shop)
        }, {
            isDraft: true,
            isPublished: false
        })

        if (!update) {
            throw new BadRequestException("Product not found.")
        }
    }

    async findAllPublishedProduct(product_shop: string, limit: number, skip: number) {
        return await this.productRepository.findAll({
            isPublished: true,
            product_shop: new Types.ObjectId(product_shop),
        }, ProductService.queryOptionsProduct(limit, skip))
    }

    async searchProduct(keySearch: string, limit: number, skip: number) {
        const results = await this.productRepository.findAll(
            {
                isPublished: true,
                $text: { $search: keySearch }
            },
            {
                sort: { score: { $meta: "textScore" } },
                ...ProductService.queryOptionsProduct(limit, skip)
            }
        )

        return results
    }
}

