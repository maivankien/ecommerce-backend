import { Module } from '@nestjs/common';
import { KafkaConfigModule } from '@config/queue/kafka/config.module';
import { KafkaConfigService } from '@config/queue/kafka/config.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'KAFKA_SERVICE',
                imports: [KafkaConfigModule],
                inject: [KafkaConfigService],
                useFactory: async (config: KafkaConfigService) => ({
                    transport: Transport.KAFKA,
                    options: {
                        client: {
                            brokers: config.brokers,
                            clientId: config.clientId,
                        },
                        consumer: {
                            groupId: config.groupId,
                            allowAutoTopicCreation: true
                        },
                        producer: {
                            allowAutoTopicCreation: true
                        }
                    }
                })
            }
        ])
    ],
    exports: [ClientsModule]
})
export class KafkaProviderModule { }
