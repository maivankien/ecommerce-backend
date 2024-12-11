import { SentMessageInfo } from 'nodemailer';
import { Injectable } from "@nestjs/common";
import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";


@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService
    ) { }

    async sendMail(options: ISendMailOptions): Promise<SentMessageInfo> {
        try {
            return await this.mailerService.sendMail(options)
        } catch (error) {
            console.error(error)
            return null
        }
    }
}