import { Types } from "mongoose";
import { NextFunction } from "express";
import { verifyToken } from "@common/utils/auth.util";
import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { HeaderApiEnum } from "@common/enums/common.enum";
import { KeyTokenService } from "@modules/v1/auth/services/keytoken.service";
import { CustomRequest } from "@common/interfaces/common.interface";

@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {
    constructor(
        private readonly keyTokenService: KeyTokenService,
    ) { }

    async use(req: CustomRequest, res: Response, next: NextFunction) {
        const userId = req.headers[HeaderApiEnum.CLIENT_ID]

        if (!userId) {
            throw new UnauthorizedException('Invalid request')
        }

        const objectId = Types.ObjectId.createFromHexString(userId)
        const keyStore = await this.keyTokenService.findOneByCondition({ user: objectId })

        if (!keyStore) {
            throw new UnauthorizedException('Invalid request')
        }

        const refreshToken = req.headers[HeaderApiEnum.REFRESH_TOKEN]
        if (refreshToken) {
            const decodeUser = verifyToken(refreshToken, keyStore.privateKey)

            if (userId !== decodeUser?.userId) {
                throw new UnauthorizedException('Invalid request')
            }
            req.user = decodeUser
            req.keyStore = keyStore
            req.refreshToken = refreshToken
            return next()
        }

        const accessToken = req.headers[HeaderApiEnum.AUTHORIZATION]
        if (!accessToken) {
            throw new UnauthorizedException('Invalid request')
        }

        const decodeUser = verifyToken(accessToken, keyStore.publicKey)
        if (userId !== decodeUser?.userId) {
            throw new UnauthorizedException('Invalid request')
        }

        req.user = decodeUser
        req.keyStore = keyStore
        return next()
    }
}