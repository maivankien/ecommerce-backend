const amqp = require('amqplib');


const runConsumer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')

        const channel = await connection.createChannel()

        const queueName = 'shop_dev'

        await channel.assertQueue(queueName, {
            durable: true
        })

        channel.consume(queueName, (message) => {
            if (message !== null) {
                console.log({
                    value: message.content.toString(),
                });
            } else {
                console.error("Received null message value");
            }
        }, {
            noAck: true
        })
    } catch (error) {
        console.error(error)
    }
}


runConsumer().catch(console.error)