import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { MongooseModule } from "@nestjs/mongoose";
import { Cart, CartSchema } from "./entities/cart.entity";
import { CartRepository } from "./repositories/cart.repository";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Cart.name, schema: CartSchema }
        ])
    ],
    controllers: [CartController],
    providers: [
        CartService,
        {
            provide: 'CartRepositoryInterface',
            useClass: CartRepository
        }
    ],
})
export class CartModule {}