import { HeaderApiEnum } from "../../enums/common.enum";
import { NextFunction, Response } from 'express';
import { RequestApiKey } from "../../interfaces/common.interface";
import { ApiKeyService } from "src/modules/v1/auth/services/api-key.service";
import { ForbiddenException, Injectable, NestMiddleware } from "@nestjs/common";


@Injectable()
export class ApiKeyMiddleware implements NestMiddleware {
    constructor(
        private readonly apiKeyService: ApiKeyService
    ) { }

    async use(req: RequestApiKey, res: Response, next: NextFunction) {
        const key = req.headers[HeaderApiEnum.API_KEY]?.toString()

        if (!key) throw new ForbiddenException('API key is required')

        const objKey = await this.apiKeyService.findOneByCondition({ key, status: true })

        if (!objKey) throw new ForbiddenException('API key is invalid')
    
        req.objKey = objKey
        next()
    }
}