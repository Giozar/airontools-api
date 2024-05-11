import mailerConfig from '@config/mailerConfig';
import * as nodemailer from 'nodemailer';

export async function mailTransportrUseCase() {
  // Cuerpo del transporte para envió de email
  return await nodemailer.createTransport({
    host: mailerConfig().emailHost,
    secure: true,
    auth: {
      user: mailerConfig().emailUser,
      pass: mailerConfig().emailPassword,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });
}
