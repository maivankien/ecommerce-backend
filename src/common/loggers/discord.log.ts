import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits, MessageCreateOptions, MessagePayload, TextChannel } from 'discord.js';

@Injectable()
export class LoggerDiscordService implements OnModuleInit {
    private readonly client: Client
    private readonly channelId: string

    constructor(
        private readonly configService: ConfigService
    ) {
        this.client = new Client({
            intents: [
                GatewayIntentBits.Guilds,
                GatewayIntentBits.DirectMessages,
                GatewayIntentBits.GuildMessages,
                GatewayIntentBits.MessageContent
            ]
        })

        this.channelId = this.configService.get<string>('app.discordChannelId')
    }

    async onModuleInit() {
        this.client.on('ready', () => {
            console.log(`Logged in as ${this.client.user.tag}!`)
        })

        this.client.on('messageCreate', (message) => {
            if (message.author.bot) return

            if (message.content === 'ping') {
                message.reply('pong')
            }
        })

        try {
            await this.client.login(this.configService.get<string>('app.discordToken'))
        } catch (error) {
            console.log("Failed to login Discord bot: ", error)
        }
    }

    async sendMessage(message: string | MessagePayload | MessageCreateOptions) {
        try {
            const channel = await this.client.channels.fetch(this.channelId)

            if (channel?.isTextBased()) {
                await (channel as TextChannel).send(message)
            } else {
                console.error(`Channel ${this.channelId} is not a text channel or does not exist.`)
            }
        } catch (error) {
            console.error(`Failed to send message to channel ${this.channelId}:`, error.message)
        }
    }

    async sendToFormatCode(payload) {
        const { message, code, title } = payload

        const codeMessage = {
            content: message,
            embeds: [
                {
                    title: title,
                    color: parseInt('00ff00', 16),
                    description: `\`\`\`${JSON.stringify(code, null, 2)}\`\`\``
                }
            ]
        }

        this.sendMessage(codeMessage)
    }
}
