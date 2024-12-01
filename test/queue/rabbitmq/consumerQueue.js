const amqp = require('amqplib');

const AMQP_URL = 'amqp://guest:guest@localhost'

const consumerToQueueNormal = async () => {
    try {
        const connection = await amqp.connect(AMQP_URL)

        const channel = await connection.createChannel()

        const notiQueue = 'notification_queue_process' // Assert queue

        // 1. TTL (Time to live) for message
        // const timeExpire = 5000
        // setTimeout(() => {
        //     channel.consume(notiQueue, (message) => {
        //         console.log(`Sending message successfully: ${message.content.toString()}`)
        //         channel.ack(message)
        //     })
        // }, timeExpire)

        // 2. Error logic
        channel.consume(notiQueue, (message) => {
            try {
                const numberTest = Math.random()

                if (numberTest < 0.5) {
                    throw new Error('Send message failed (Hot fix) ...')
                }
                console.log(`Sending message successfully: ${message.content.toString()}`)
                channel.ack(message)
            } catch (error) {
                console.log(error.message)
                // nack: negative acknowledgment
                channel.nack(message, false, false)
            }
        })
    } catch (error) {
        console.error(error)
    }
}


const consumerToQueueFailed = async () => {
    try {
        const connection = await amqp.connect(AMQP_URL)

        const channel = await connection.createChannel()

        const noitificationExchangeDLX = 'notification_exchange_DLX' // Notification exchange DLX
        const notificationRoutingKeyDLX = 'notification_routing_key_DLX' // Routing key for the DLX


        const notiQueueHandle = 'notification_queue_hot_fix'


        await channel.assertExchange(noitificationExchangeDLX, 'direct', {
            durable: true
        })

        const queueResult = await channel.assertQueue(notiQueueHandle, {
            exclusive: false,
        })

        await channel.bindQueue(queueResult.queue, noitificationExchangeDLX, notificationRoutingKeyDLX)

        await channel.consume(queueResult.queue, (message) => {
            console.log(`Sending message failed (Hot fix): ${message.content.toString()}`)
        }, {
            noAck: true
        })

    } catch (error) {
        console.error(error)
    }
}


consumerToQueueNormal().catch(console.error)
consumerToQueueFailed().catch(console.error)