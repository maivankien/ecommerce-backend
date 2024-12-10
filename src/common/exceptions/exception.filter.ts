import { MyLogger } from '@common/loggers/logger.log';
import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';


@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    constructor(
        private readonly logger: MyLogger,
    ) { }

    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse()
        const request = ctx.getRequest()

        let message: string | object
        let status = HttpStatus.INTERNAL_SERVER_ERROR

        if (exception instanceof HttpException) {
            status = exception.getStatus()
            message = exception.getResponse()

            if (typeof message === 'string') {
                message = { message }
            }

            const errorMessage = `Message: ${message['message']} - Time: ${Date.now() - request.timestamp}ms`
            this.logger.error(errorMessage, [
                request.path,
                { requestId: request.requestId },
                JSON.stringify(exception),
            ])

            return response.status(status).json(message)
        }

        console.error(exception)

        const errorMessage = `Message: ${exception['message']} - Time: ${Date.now() - request.timestamp}ms`
        this.logger.error(errorMessage, [
            request.path,
            { requestId: request.requestId },
            JSON.stringify(exception)
        ])

        response.status(status).json({
            statusCode: status,
            message: 'Internal server error',
            timestamp: new Date().toISOString(),
            path: request.path,
        })
    }
}
