import * as bcrypt from 'bcrypt'
import { Shop } from "./entities/shop.entity";
import { ConflictException, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { ShopRepositoryInterface } from "./interface/shop.interface";
import { SALT_ROUNDS } from '@common/constants/common.constants';
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { RoleShopEnum } from '@common/enums/common.enum';
import { KeyTokenService } from '../auth/services/keytoken.service';
import { createTokenPair, generatePrivateAndPublicKey } from '@common/utils/auth.util';
import { getInfoData } from '@common/utils/common.util';


@Injectable()
export class ShopService extends BaseServiceAbstract<Shop> {
    constructor(
        @Inject('ShopRepositoryInterface')
        private readonly shopRepository: ShopRepositoryInterface,

        private readonly keyTokenService: KeyTokenService
    ) {
        super(shopRepository)
    }

    public async createShop(input: Shop) {
        const holderShopExists = await this.shopRepository.findOneByCondition({ name: input.email }, { _id: 1 })

        if (holderShopExists) throw new ConflictException('Shop already exists')

        const hashedPassword = await bcrypt.hash(input.password, SALT_ROUNDS)
        const newShop = await this.shopRepository.create({ ...input, password: hashedPassword, roles: [RoleShopEnum.SHOP] })

        if (!newShop) {
            throw new InternalServerErrorException("Failed to create new Shop")
        }

        const { privateKey, publicKey } = generatePrivateAndPublicKey()
        const publicKeyString = await this.keyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey })

        if (!publicKeyString) {
            throw new InternalServerErrorException("Failed to create public key")
        }

        const tokens = createTokenPair({ userId: newShop._id, email: input.email, roles: newShop.roles }, publicKey, privateKey)

        return {
            metadata: {
                tokens: tokens,
                shop: getInfoData(["_id", "name", "email", "roles"], newShop)
            }
        }
    }
}