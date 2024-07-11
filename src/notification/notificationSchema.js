const gql = require('graphql');

const schema = gql.buildSchema(`
    type Notification {
        id: String!
        userId: String!
        message: String!
        read: Boolean!
    }

    type Query {
        getNotifications: [Notification]
        getNotification(id: String!): Notification
    }

    type Mutation {
        createNotification(userId: String!, message: String!): Notification
        markAsRead(id: String!): Notification
    }
`);

module.exports = schema;


