import 'winston-daily-rotate-file'
import { Injectable } from '@nestjs/common';
import { LoggerLevelEnum } from '@common/enums/common.enum';
import { format, transports, createLogger, Logger } from 'winston';

@Injectable()
export class MyLogger {
    private readonly logger: Logger

    constructor() {
        const formatPrint = format.printf(
            ({ level, message, context, requestId, timestamp, metadata }: any) => {
                return `${timestamp} [${level}] [${context}] [${requestId}] ${message} ${JSON.stringify(metadata)}`
            }
        )

        this.logger = createLogger({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                formatPrint
            ),
            transports: [
                // new transports.Console(),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.info.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: LoggerLevelEnum.INFO,
                }),
                new transports.DailyRotateFile({
                    dirname: 'logs',
                    filename: 'application-%DATE%.error.log',
                    datePattern: 'YYYY-MM-DD-HH-mm',
                    zippedArchive: true,
                    maxSize: '10m',
                    maxFiles: '14d',
                    format: format.combine(
                        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                        formatPrint
                    ),
                    level: LoggerLevelEnum.ERROR,
                })
            ]
        })
    }

    private commonParams(params) {
        let context, req, metadata

        if (Array.isArray(params)) {
            [context, req, metadata] = params
        } else {
            ({ context, req, metadata } = params)
        }

        const requestId = req?.requestId

        return { context, req, metadata, requestId }
    }

    log(message: string, params: object) {
        const paramLog = this.commonParams(params)
        const logObject = { message, ...paramLog }

        this.logger.info(logObject)
    }

    error(message: string, params: object) {
        const paramLog = this.commonParams(params)
        const logObject = { message, ...paramLog }

        this.logger.error(logObject)
    }
}