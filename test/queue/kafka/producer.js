const { Kafka } = require('kafkajs')

const kafka = new Kafka({
    clientId: 'notification',
    brokers: ['localhost:9092']
})

const producer = kafka.producer()

const run = async () => {
    await producer.connect()
    await producer.send({
        topic: 'notification-consumer',
        messages: [
            { value: 'Hello KafkaJS111 user!' },
        ],
    })

    await producer.disconnect()
}


run().catch(console.error)