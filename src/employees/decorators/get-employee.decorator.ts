import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';

export const GetEmployee = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    console.log(data);
    const request = ctx.switchToHttp().getRequest();
    const employee = request.employee;

    if (!employee) {
      throw new InternalServerErrorException('Empleado no encontrado');
    }

    return !data ? employee : employee[data];
  },
);
