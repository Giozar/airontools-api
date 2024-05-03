import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailController } from './email.controller';
import { MailerModule } from '@nestjs-modules/mailer';
import mailerConfig from '@config/mailerConfig';

@Module({
  imports: [
    MailerModule.forRoot({
      transport: {
        host: mailerConfig().emailHost,
        auth: {
          user: mailerConfig().emailUser,
          pass: mailerConfig().emailPassword,
        },
        
      }
    })
  ],
  controllers: [EmailController],
  providers: [EmailService],
})
export class EmailModule {}
