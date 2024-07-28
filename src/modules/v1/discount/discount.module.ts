import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscountService } from "./discount.service";
import { DiscountController } from "./discount.controller";
import { Discount, DiscountSchema } from "./entities/discount.entity";
import { DiscountRepository } from "./repositories/discount.repository";
import { ProductService } from "../product/services/product.service";
import { Product, ProductSchema } from "../product/entities/product.entity";
import { ProductRepository } from "../product/repositories/product.repository";

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Discount.name, schema: DiscountSchema },
            { name: Product.name, schema: ProductSchema }
        ])
    ],
    controllers: [DiscountController],
    providers: [
        DiscountService,
        {
            provide: 'DiscountRepositoryInterface',
            useClass: DiscountRepository
        },
        ProductService,
        {
            provide: 'ProductRepositoryInterface',
            useClass: ProductRepository
        }
    ],
})
export class DiscountModulle { }