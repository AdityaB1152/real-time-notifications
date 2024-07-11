
const amqp = require('amqplib');
const uri = process.env.RABBIT_URI;

let connection , channel;


async function connectQueue() {
    try {
         connection = await amqp.connect(uri);
        console.log('Connected to RabbitMQ');
        
        return connection;
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error.message);
        throw error;
    }
}

async function createChannel(connection) {
    try {
         channel = await connection.createChannel();
        console.log('Channel created');
       
        return channel;
    } catch (error) {
        console.error('Error creating channel:', error.message);
        throw error;
    }
}

const sendMessageToQueue = async (queue, message) => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), { persistent: true });
        console.log(`Message sent to queue ${queue}`);
    } catch (error) {
        console.error('Error sending message to queue:', error.message);
    }
};

const consumeMessages = async (queue, callback) => {
    if (!channel) {
        throw new Error('RabbitMQ channel is not initialized');
    }
    try {
        await channel.assertQueue(queue, { durable: true });
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                const message = JSON.parse(msg.content.toString());
                callback(message);
                channel.ack(msg);
            }
        });
        console.log(`Consuming messages from queue ${queue}`);
    } catch (error) {
        console.error('Error consuming messages from queue:', error.message);
    }
};


module.exports = {
    connectQueue,
    createChannel,
    consumeMessages,
    sendMessageToQueue
};
