import { v4 as uuidv4 } from 'uuid';
import { MyLogger } from "@common/loggers/logger.log";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";


export interface RequestWithId extends Request {
    timestamp: number
    requestId: string
}

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
    constructor(
        private readonly logger: MyLogger
    ) { }

    use(req: RequestWithId, res: Response, next: NextFunction) {
        const requestId = Array.isArray(req.headers['x-request-id']) ? req.headers['x-request-id'][0] : req.headers['x-request-id']

        req.timestamp = Date.now()
        req.requestId = requestId || uuidv4()

        this.logger.log(`Input params: ${req.method}`, [
            req.originalUrl,
            { requestId: req.requestId },
            req.method === 'GET' ? req.query : req.body
        ])

        next()
    }
}