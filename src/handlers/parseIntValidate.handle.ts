import { BadRequestException } from '@nestjs/common';

export function parseIntValidate(opt?: string): number | undefined {
  if (!opt) {
    return undefined; // Retorna undefined si no se proporciona `opt`
  }

  const parsedOpt = parseInt(opt, 10);

  if (isNaN(parsedOpt)) {
    throw new BadRequestException('The opt query parameter must be a number');
  }

  return parsedOpt;
}
