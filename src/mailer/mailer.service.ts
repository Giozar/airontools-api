import { Injectable } from '@nestjs/common';
import { sendMailUseCase } from './uses-cases';

@Injectable()
export class MailerService {

    async sendMail(){
        return await sendMailUseCase();
    }
}
