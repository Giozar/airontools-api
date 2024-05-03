import mailerConfig from "@config/mailerConfig";
import { mailTransportrUseCase } from "./mail-transport.use-case";

export async function sendMailUseCase() {
    
    const mailOption = {
        from: mailerConfig().emailUser,
        to: mailerConfig().emailUser,
        subject: 'Asunto: Prueba para Airon Tools',
        html: 'Mi mensaje',
    };

    try {
        const isTransporter = await mailTransportrUseCase();
        await isTransporter.sendMail( mailOption );
        return Promise.resolve('Message sent successfully!');
    } catch (error) {
        return Promise.reject(error);
    }  
}