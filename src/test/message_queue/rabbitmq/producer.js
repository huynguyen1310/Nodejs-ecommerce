const amqp = require('amqplib')
const message = 'hello, RabbitMQ for js'

const runProducer = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost')
    const channel = await connection.createChannel()

    const queueName = 'test-topic'
    await channel.assertQueue(queueName, {
      durable: true
    })

    channel.sendToQueue(queueName, Buffer.from(message))
    console.log('message sent: ', message)

  } catch (error) {
    console.log(error)
  }
}

runProducer().catch(console.error)
