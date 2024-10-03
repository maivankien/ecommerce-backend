import { LoggerDiscordService } from "@common/loggers/discord.log";
import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";


@Injectable()
export class LoggerDiscordMiddleware implements NestMiddleware {
    constructor(
        private readonly loggerDiscordService: LoggerDiscordService
    ) { }

    use(req: Request, res: Response, next: NextFunction) {
        this.loggerDiscordService.sendToFormatCode({
            title: 'Method: ' + req.method,
            message: `${req.get('host')}${req.originalUrl}`,
            code: req.method === 'GET' ? req.query : req.body
        })
        next()
    }
}