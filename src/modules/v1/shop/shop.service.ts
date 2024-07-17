import * as bcrypt from 'bcrypt'
import { Shop } from "./entities/shop.entity";
import { ShopRepositoryInterface } from "./interface/shop.interface";
import { SALT_ROUNDS } from '@common/constants/common.constants';
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { RoleShopEnum } from '@common/enums/common.enum';
import { KeyTokenService } from '../auth/services/keytoken.service';
import { createTokenPair, generatePrivateAndPublicKey } from '@common/utils/auth.util';
import { getInfoData } from '@common/utils/common.util';
import {
    BadRequestException, ConflictException,
    ForbiddenException, Inject, Injectable, InternalServerErrorException, UnauthorizedException
} from "@nestjs/common";
import { KeyToken } from '../auth/entities/keytoken.entity';
import { PayloadJwt } from '@common/interfaces/common.interface';


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
        const tokens = createTokenPair({ userId: newShop._id, email: input.email, roles: newShop.roles }, publicKey, privateKey)

        const publicKeyString = await this.keyTokenService.createKeyToken({ userId: newShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken })

        if (!publicKeyString) {
            throw new InternalServerErrorException("Failed to create public key")
        }

        return {
            tokens: tokens,
            shop: getInfoData(["_id", "name", "email", "roles"], newShop)
        }
    }

    public async loginShop({ email, password }: { email: string, password: string }) {
        const foundShop = await this.shopRepository.findOneByCondition({
            email: email
        }, {
            email: 1,
            name: 1,
            status: 1,
            roles: 1,
            password: 1,
        })

        if (!foundShop) {
            throw new BadRequestException('Email or password is incorrect')
        }

        const match = await bcrypt.compare(password, foundShop.password)
        if (!match) {
            throw new BadRequestException('Email or password is incorrect')
        }

        const { privateKey, publicKey } = generatePrivateAndPublicKey()
        const tokens = createTokenPair({ userId: foundShop._id, email: email, roles: foundShop.roles }, publicKey, privateKey)

        await this.keyTokenService.createKeyToken({ userId: foundShop._id, publicKey, privateKey, refreshToken: tokens.refreshToken })
        return {
            tokens: tokens,
            shop: getInfoData(["_id", "name", "email", "roles"], foundShop)
        }
    }

    public async handleRefreshToken({ refreshToken, user, keyStore }: { refreshToken: string, user: PayloadJwt, keyStore: KeyToken }) {
        const { userId, email } = user

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            await this.keyTokenService.remove(keyStore._id.toString())
            throw new ForbiddenException('Something wrong happened !! Please login again.')
        }

        if (keyStore.refreshToken !== refreshToken) {
            throw new UnauthorizedException('Invalid refresh token')
        }

        const foundShop = await this.shopRepository.findOneById(userId, {
            email: 1,
            name: 1,
            roles: 1,
        })

        if (!foundShop) {
            throw new UnauthorizedException('Shop not registered')
        }

        // Create new accessToken and refreshToken
        const tokens = createTokenPair({ userId: foundShop._id, email: email, roles: foundShop.roles }, keyStore.publicKey, keyStore.privateKey)

        await this.keyTokenService.update(keyStore._id.toString(), {
            $set: {
                refreshToken: tokens.refreshToken
            },
            $addToSet: {
                refreshTokensUsed: refreshToken
            }
        })

        return {
            tokens: tokens,
            shop: foundShop
        }
    }
}