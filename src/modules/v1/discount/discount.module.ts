import { AuthModule } from "../auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { DiscountService } from "./discount.service";
import { ProductModule } from "../product/product.module";
import { DiscountController } from "./discount.controller";
import { Discount, DiscountSchema } from "./entities/discount.entity";
import { DiscountRepository } from "./repositories/discount.repository";
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { AuthenticationMiddleware } from "@common/middlewares/auth/authentication.middleware";

@Module({
    imports: [
        ProductModule,
        AuthModule,
        MongooseModule.forFeature([
            { name: Discount.name, schema: DiscountSchema },
        ])
    ],
    controllers: [DiscountController],
    providers: [
        DiscountService,
        {
            provide: 'DiscountRepositoryInterface',
            useClass: DiscountRepository
        },
    ],
    exports: [
        DiscountService
    ]
})
export class DiscountModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(AuthenticationMiddleware).forRoutes(
            { path: 'v1/discount', method: RequestMethod.POST },
            { path: 'v1/discount/shop', method: RequestMethod.GET },
            { path: 'v1/discount/amount', method: RequestMethod.POST },
            { path: 'v1/discount/:id', method: RequestMethod.PATCH },
            { path: 'v1/discount/:id', method: RequestMethod.DELETE },
        )
    }
}