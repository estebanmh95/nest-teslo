import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const getRawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    const rawHeaders = req.rawHeaders;
    return rawHeaders;
  },
);
