import helmet from 'helmet';
import * as morgan from 'morgan';
import * as compression from 'compression';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';


@Injectable()
export class CombinedMiddleware implements NestMiddleware {
    private readonly helmetMiddleware = helmet()
    private readonly morganMiddleware = morgan('dev')
    private readonly compressionMiddleware = compression()

    use(req: Request, res: Response, next: NextFunction) {
        this.compressionMiddleware(req, res, (err) => {
            if (err) {
                return next(err)
            }
            this.helmetMiddleware(req, res, (err) => {
                if (err) {
                    return next(err)
                }
                this.morganMiddleware(req, res, next)
             })
        })
    }
}
