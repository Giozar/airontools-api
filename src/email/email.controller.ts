import { Controller, Get, Res } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Get()
  sendMailer(@Res() response: any) {
    const mail = this.emailService.sendEmail();

    return response.status(200).json({
      message: 'succes',
      mail,
    });
  };
};

