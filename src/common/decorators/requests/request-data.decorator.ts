import { CustomRequest } from '@common/interfaces/common.interface';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

type ValidRequestKeys = keyof CustomRequest

export const RequestData = createParamDecorator(
    <T extends ValidRequestKeys>(data: T, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest<CustomRequest>()
        return request[data]
    }
)
