require("dotenv").config();
const http = require('http');
const express = require('express');
const connectDb = require('./src/config/dbConfig');
const {register , login} = require('./src/auth/authController');
const authenticateJWT = require('./src/middleware/authMiddleware');
const notificationSchema = require('./src/notification/notificationSchema');
const notificationResolver = require('./src/notification/notificationResolver')
const { createHandler } = require('graphql-http/lib/use/express');
const app = express();
const PORT = 3000
app.use(express.json());


const { connectQueue, createChannel } = require('./src/config/queueConfig');
const { initializeSocket } = require("./src/connection/connectionService");


connectDb().then(()=>{
    console.log('Mongo DB Successfully connected');
    app.listen(PORT , ()=>{
        console.log('App is running on port 3000');
    });
    });

    const server = http.createServer(app);

setupQueue().then(()=>{
    initializeSocket(server);
})


async function setupQueue() {
    try {
        const connection = await connectQueue();
        const channel = await createChannel(connection);

        
        const queueName = 'notification_queue';
        await channel.assertQueue(queueName, { durable: true }).then(()=>{
            console.log('Queue created :'+queueName);

        })
        
       
        
    } catch (error) {
        console.error('Error setting up RabbitMQ:', error.message);
    }
}


 
app.use('/graphql' , authenticateJWT , createHandler({
    schema:notificationSchema,
    rootValue:notificationResolver,
}) );

app.post('/login',login);

app.post('/register',register);

