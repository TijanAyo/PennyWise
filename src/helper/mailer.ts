import nodemailer from "nodemailer";
import { logger } from "./logger";

class MailerService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            // secure: false,
            //secure: process.env.SMTP_TLS === 'yes' ? true : false,
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD
            },
        });
    }

    public async sendEmail(to: string, subject: string, text: string) {
        const mailOptions: nodemailer.SendMailOptions = {
            from: `"Gloria From PennyWise" ${process.env.SMTP_SENDER}`,
            to,
            subject,
            text
        }
        const info = await this.transporter.sendMail(mailOptions);
        logger.info(`Message sent to ${to} with message ID: ${info.messageId}`);
    }

}
export default MailerService;