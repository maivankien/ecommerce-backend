import helmet from 'helmet';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class HelmetMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        helmet()(req, res, next)
    }
}
