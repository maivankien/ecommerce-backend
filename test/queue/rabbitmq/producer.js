const amqp = require('amqplib');


const message = "Hello RabbitMQ user!"

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')

        const channel = await connection.createChannel()

        const queueName = 'shop_dev'

        await channel.assertQueue(queueName, {
            durable: true
        })

        await channel.sendToQueue(queueName, Buffer.from(message))

        console.log(`Message sent: ${message}`)

        
    } catch (error) {
        console.error(error)
    }
}


runProducer().catch(console.error)