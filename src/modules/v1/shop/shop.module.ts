import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Shop, ShopSchema } from "./entities/shop.entity";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { ShopRepository } from "./shop.repository";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Shop.name, schema: ShopSchema }
        ])
    ],
    providers: [
        ShopService,
        {
            provide: 'ShopRepositoryInterface',
            useClass: ShopRepository
        }
    ],
    controllers: [ShopController],
})
export class ShopModule {}