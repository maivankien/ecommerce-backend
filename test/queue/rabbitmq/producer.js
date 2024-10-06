const amqp = require('amqplib');


const message = "Hello RabbitMQ user!"

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')

        const channel = await connection.createChannel()

        const queueName = 'test-topic'

        await channel.assertQueue(queueName, {
            durable: false
        })

        await channel.sendToQueue(queueName, Buffer.from(message))

        console.log(`Message sent: ${message}`)

        
    } catch (error) {
        console.error(error)
    }
}


runProducer().catch(console.error)