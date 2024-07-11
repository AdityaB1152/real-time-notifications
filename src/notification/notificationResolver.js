
const Notification = require('../models/Notification');
const ampq = require('amqplib');

const resolver = {
    getNotifications : async (args , context ) => {
        const {user } = context ;
        if(!user) {
            throw new Error('Unauthorized');

        }
        return await Notification.find({userId:user.id});
    },

    getNotifications : async ({id} , context) =>{
        const {user}  = context ;
        if(!user){
            throw new Error('Unauthorized');
        }
        return await Notification.findOne({id, userId:user.id})
    },

    createNotification : async ({userId , message}) => {
        const notification = new Notification({ userId , message});
        await notification.save();

        ampq.connect(process.env.RABBIT_URI , (err0 , connection)=>{
            if(err0){
                throw err0;
            }

            connection.createChannel((err1,channel)=>{
                if(err1){
                    throw err1;
                }
                const queue = 'notification'
                const msg = JSON.stringify(notification);

                channel.sendToQueue(queue , Buffer.from(msg));
                console.log('Sent Message to queue :'+ msg);

            })
        })

        return notification;
        
    },

    markAsRead: async ({ id }) => {
        try {
            
            const notification = await Notification.findById(id);
            if (!notification) {
                throw new Error('Notification not found');
            }
            notification.read = true;
            await notification.save();

            return notification;
        } catch (err) {
            console.error(err);
            throw new Error('Failed to mark notification as read');
        }
    }

     
}

module.exports = resolver;