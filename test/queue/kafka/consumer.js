const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'notification',
    brokers: ['localhost:9092']
})

const consumer = kafka.consumer({ groupId: 'notification-consumer' })

const run = async () => {
    await consumer.connect()
    await consumer.subscribe({ topic: 'notification-consumer', fromBeginning: true, allowAutoTopicCreation: true })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if (message.value !== null) {
                console.log({
                    value: message.value.toString(),
                });
            } else {
                console.error("Received null message value");
            }
        },
    })
}

run().catch(console.error)
