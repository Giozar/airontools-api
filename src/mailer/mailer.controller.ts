import { Controller, Get, Res } from '@nestjs/common';
import { MailerService } from './mailer.service';

@Controller('mailer')
export class MailerController {
  constructor(private readonly mailerService: MailerService) {}

  @Get()
  async sendMail() {
    return await this.mailerService.sendMail()
  }
}
