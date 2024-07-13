import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Shop, ShopSchema } from "./entities/shop.entity";
import { ShopController } from "./shop.controller";
import { ShopService } from "./shop.service";
import { ShopRepository } from "./shop.repository";
import { KeyTokenService } from "../auth/services/keytoken.service";
import { KeyTokenRepository } from "../auth/repositories/keytoken.repository";
import { KeyToken, KeyTokenSchema } from "../auth/entities/keytoken.entity";


@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Shop.name, schema: ShopSchema },
            { name: KeyToken.name, schema: KeyTokenSchema }
        ])
    ],
    providers: [
        ShopService,
        {
            provide: 'ShopRepositoryInterface',
            useClass: ShopRepository
        },
        KeyTokenService,
        {
            provide: 'KeyTokenRepositoryInterface',
            useClass: KeyTokenRepository
        }
    ],
    controllers: [ShopController],
})
export class ShopModule {}