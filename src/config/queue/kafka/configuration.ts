import { registerAs } from '@nestjs/config';

export default registerAs('kafka', () => ({
    clientId: process.env.KAFKA_CLIENT_ID,
    groupId: process.env.KAFKA_GROUP_ID,
    brokers: JSON.parse(process.env.KAFKA_BROKERS),
}))