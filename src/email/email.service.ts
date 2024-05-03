import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import mailerConfig from '@config/mailerConfig';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) {}

    sendEmail() {
        const message = 'Hola mensaje desde servidor local';

        this.mailerService.sendMail({
            from: mailerConfig().emailUser,
            to: mailerConfig().emailUser,
            subject: 'Asunto prueba local',
            text: message,
        });
    }
}
