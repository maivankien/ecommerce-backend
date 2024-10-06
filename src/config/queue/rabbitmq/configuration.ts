import { registerAs } from '@nestjs/config';

export default registerAs('rabbitmq', () => ({
    queue: process.env.RABBITMQ_QUEUE,
    urls: JSON.parse(process.env.RABBITMQ_URLS),
}))