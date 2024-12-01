const amqp = require('amqplib');


const message = "Hello RabbitMQ user!"

const runProducer = async () => {
    try {
        const connection = await amqp.connect('amqp://guest:guest@localhost')

        const channel = await connection.createChannel()

        const notiQueue = 'notification_queue_process' // Assert queue
        const notificationExchange = 'notification_exchange'  // Notification exchange direct
        const noitificationExchangeDLX = 'notification_exchange_DLX' // Notification exchange DLX
        const notificationRoutingKeyDLX = 'notification_routing_key_DLX' // Routing key for the DLX

        // Create notification exchange
        await channel.assertExchange(notificationExchange, 'direct', {
            durable: true
        })

        // Create notification queue
        const queue = await channel.assertQueue(notiQueue, {
            durable: true,
            exclusive: false, // Cho phép các kết nối khác sử dụng queue này
            deadLetterExchange: noitificationExchangeDLX,
            deadLetterRoutingKey: notificationRoutingKeyDLX
        })

        // Bind notification queue to notification exchange
        await channel.bindQueue(queue.queue, notificationExchange)

        // Send message to notification queue
        channel.sendToQueue(queue.queue, Buffer.from(message), {
            expiration: '10000'
        })

    } catch (error) {
        console.error(error)
    }
}


runProducer().catch(console.error)