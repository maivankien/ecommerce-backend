import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailConfigModule } from "@config/mail/config.module";
import { MailConfigService } from "@config/mail/config.service";
import { MailService } from "@common/services/mail.service";


@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [MailConfigModule],
            inject: [MailConfigService],
            useFactory: async (config: MailConfigService) => ({
                transport: {
                    host: config.host,
                    auth: {
                        user: config.username,
                        pass: config.password,
                    },
                    secure: config.encryption === 'ssl' || config.encryption === 'tls'
                },
                defaults: {
                    replyTo: config.from,
                    from: `"${config.name}" <${config.from}`
                }                
            })
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailProviderModule {}