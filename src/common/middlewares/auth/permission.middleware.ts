import { Response, NextFunction } from 'express';
import { RequestApiKey } from '../../interfaces/common.interface';
import { ForbiddenException } from '@nestjs/common';
import { PermissionApiKeyEnum } from '../../enums/common.enum';

export function permissionMiddleware(permission: PermissionApiKeyEnum) {
    return (req: RequestApiKey, res: Response, next: NextFunction) => {
        if (!req.objKey.permissions) {
            throw new ForbiddenException('Permission denied!')
        }

        const validPermission = req.objKey.permissions.includes(permission)
        if (!validPermission) {
            throw new ForbiddenException('Permission denied!')
        }

        return next()
    }
}
