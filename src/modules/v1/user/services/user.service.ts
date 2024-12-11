import { User } from "../entities/user.entity";
import { UserRepositoryInterface } from "../interfaces/user.interface";
import { OtpService } from "@modules/v1/mail/services/otp.service";
import { TemplateService } from "@modules/v1/mail/services/template.service";
import { MailService } from "@common/services/mail.service";
import { replacePlaceholder } from "@common/utils/common.util";
import { BaseServiceAbstract } from "@common/mongo/base/services/base.abstract.service";
import { ConflictException, Inject, Injectable, NotFoundException } from "@nestjs/common";


@Injectable()
export class UserService extends BaseServiceAbstract<User> {
    constructor(
        @Inject('UserRepositoryInterface')
        private readonly userRepository: UserRepositoryInterface,

        private readonly otpService: OtpService,
        private readonly mailService: MailService,
        private readonly templateService: TemplateService,
    ) {
        super(userRepository)
    }

    private async sendMailToken(email: string) {
        // 1. Get token
        const token = await this.otpService.createOtp(email)

        // 2. Get template
        const template = await this.templateService.getTemplate('HTML_EMAIL_TOKEN')

        if (!template) {
            throw new NotFoundException('Template not found')
        }

        // 3. Replace placeholder with params
        const content = replacePlaceholder(
            template.html,
            {
                link_verify: `http://localhost:3000/verify?token=${token.token}`
            })

        // 4. Send mail
        this.mailService.sendMail({
            to: email,
            html: content,
            subject: 'Xác thực tài khoản đăng ký',
        })
    }

    async createNewUser(email: string) {
        const user = await this.userRepository.findOne({ email }, { email: 1 })

        if (user) {
            throw new ConflictException('User already exists')
        }

        this.sendMailToken(email)
    }
}