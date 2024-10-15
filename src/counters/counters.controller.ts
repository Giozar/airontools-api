import { Controller, Post } from '@nestjs/common';
import { CountersService } from './counters.service';

@Controller('counters')
export class CountersController {
  constructor(private readonly countersService: CountersService) {}

  @Post('reset/order')
  async resetOrderCounter() {
    await this.countersService.resetSequence('order', 4000); // Reinicia el contador al número requerido
    return { message: 'El contador de órdenes ha sido reiniciado.' };
  }
}
