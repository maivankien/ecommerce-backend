import * as bcrypt from 'bcrypt'
import { Shop } from "./entities/shop.entity";
import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { ShopRepositoryInterface } from "./interface/shop.interface";
import { SALT_ROUNDS } from 'src/common/constants/common.constants';
import { BaseServiceAbstract } from "src/common/mongo/base/services/base.abstract.service";
import { RoleShopEnum } from 'src/common/enums/common.enum';
import { generatePrivateAndPublicKey } from 'src/common/utils/common.util';


@Injectable()
export class ShopService extends BaseServiceAbstract<Shop> {
    constructor(
        @Inject('ShopRepositoryInterface')
        private readonly shopRepository: ShopRepositoryInterface
    ) {
        super(shopRepository)
    }

    public async createShop(input: Shop) {
        const holderShop = await this.shopRepository.findOneByCondition({ name: input.email })

        if (holderShop) throw new ConflictException('Shop already exists')

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)

        const newShop = await this.shopRepository.create({ ...input, password: hashedPassword, roles: [RoleShopEnum.SHOP] })

        const { privateKey, publicKey } = generatePrivateAndPublicKey()

        return { privateKey, publicKey }
    }
}