import * as morgan from 'morgan';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';


@Injectable()
export class MorganMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        morgan('dev')(req, res, next)
    }
}
