const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const NotificationSchema = new mongoose.Schema({
    id: {
        type: String,
        default: uuidv4,
    },
    userId: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    read: {
        type: Boolean,
        default: false,
    },
});

module.exports = mongoose.model('Notification', NotificationSchema);
