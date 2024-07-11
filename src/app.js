const express = require('express');
const mongoose = require('mongoose');
const { createHandler } = require('graphql-http/lib/use/express') ;

const connectDb = require('./config/dbConfig');  
const connectQueue =  require('./config/queueConfig') ;

const authRoutes = require('./auth/authRoutes');


const notificationSchema = require('./notification/notificationSchema');
const notificationResolver = require('./notification/notificationResolver')
const authenticateJWT = require('./middleware/authMiddleware')

const app = express();


connectDb();
connectQueue();

app.use(express.json);
app.use('/api' , authRoutes);

app.use('/graphql',authenticateJWT, createHandler({schema:notificationSchema,
    rootValue:notificationResolver,
    graphiql:true,
}));

module.exports = app;


