import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client, GatewayIntentBits } from 'discord.js';

@Injectable()
export class LoggerDiscordService implements OnModuleInit {
    private readonly client: Client

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
}
