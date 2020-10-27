import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { version } from '@app/apiVersion.json'

@Injectable()
export class ApiVersionMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void) {
        res.setHeader('api-version', version);
        next();
    }
}
