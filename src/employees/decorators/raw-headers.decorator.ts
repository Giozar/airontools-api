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
      throw new InternalServerErrorException('Headers no encontrado');
    }

    return !data ? headers : headers[data];
  },
);
