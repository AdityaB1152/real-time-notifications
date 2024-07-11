// real-time.service.js
const socketIo = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assuming User model is in models/User.js
const { consumeMessages, sendMessageToQueue } = require('../config/queueConfig');

let io;

const initializeSocket = (server) => {
    io = socketIo(server);

    io.use((socket, next) => {
        const token = socket.handshake.query.token;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
                if (err) return next(new Error('Authentication error'));
                socket.user = decoded.user;
                
                console.log('Current user '+socket.user.)
                
                await User.findByIdAndUpdate(socket.user.id, { connected: true });
                next();
            });
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('User connected:', socket.user.username);

       
        socket.join(socket.user.id);

        socket.on('disconnect', async () => {
            console.log('User disconnected:', socket.user.username);

            
            await User.findByIdAndUpdate(socket.user.id, { connected: false });
        });
    });

    consumeMessages('notifications', async (message) => {
        const { userId, notification } = message;

        
        const user = await User.findById(userId);
        if (user && user.connected) {
            io.to(userId).emit('notification', notification);
        } else {
            console.log('User is not connected.');
            
        }
    });
};

const notifyUser = async (userId, message) => {
    try {
        await sendMessageToQueue('notifications', { userId, notification: message });
    } catch (error) {
        console.error('Error notifying user:', error.message);
    }
};

module.exports = { initializeSocket, notifyUser };
