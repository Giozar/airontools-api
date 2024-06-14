import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const headers = request.rawHeaders;

    if (!headers) {
      throw new InternalServerErrorException('Headers not found');
    }

    return !data ? headers : headers[data];
  },
);
