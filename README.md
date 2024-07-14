# Real-Time Notification System

## Overview

This project is an advanced assignment from Starportal to create a microservices-based real-time notification system using Node.js. The system handles high-volume message processing and delivers real-time notifications to users. It integrates message queues and implements real-time data streaming.


## Features Implemented

- **User Authentication**: Users can register and log in using REST endpoints.
- **Notification Management**: Notifications can be created, fetched, and marked as read using GraphQL.
- **Real-Time Notifications**: Real-time notification delivery using Socket.IO and RabbitMQ.
- **User Connection Status**: Updates user connection status in MongoDB.

## Technologies Used

- **Node.js**: For server-side JavaScript runtime.
- **Express**: As the web application framework.
- **MongoDB**: To store user and notification data.
- **Mongoose**: For MongoDB object modeling.
- **RabbitMQ**: For message queuing.
- **Socket.IO**: For real-time communication.
- **JWT (JSON Web Token)**: For authentication.
- **dotenv**: For environment variable management.

## Project Structure

- **Auth Service (REST)**:
  - `POST /api/register`: Register a new user.
  - `POST /api/login`: Login and receive a JWT.
- **Notification Service (GraphQL)**:
  - `mutation createNotification(userId: ID!, message: String!): Notification`: Create a new notification for a user and push it to the queue.
  - `query getNotifications: [Notification]`: Get a list of all notifications for the authenticated user.
  - `query getNotification(id: ID!): Notification`: Get details of a specific notification.
  - `mutation markNotificationAsRead(id: ID!): Notification`: Mark a notification as read.
- **Real-Time Service**:
  - Establishes a WebSocket connection for real-time notifications.
  - Listens for new notifications from the queue and broadcasts them to the connected users.

## File Structure

### `index.js`

The entry point of the application where the Express server is initialized and the RabbitMQ connection is established.

### `src/config/queueConfig.js`

Contains the RabbitMQ connection logic and functions to send and consume messages from the queue.

### `src/models/User.js`

Defines the User schema and model using Mongoose.

### `src/models/Notification.js`

Defines the Notification schema and model using Mongoose.

### `src/auth/authService.js`

Handles user registration and login, including password hashing and JWT generation.

### `src/notification/notificationResolver.js` and 'src/notification/notificationSchema'

Contains the GraphQL implementation for creating, fetching, and updating notifications.

### `src/connectionService.js`

Initializes the Socket.IO server, manages user connection statuses, and handles real-time notification broadcasting.

## How to Run

1. **Clone the Repository**:
    ```bash
    git clone https://github.com/yourusername/real-time-notification-system.git
    cd real-time-notification-system
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Set Up Environment Variables**:
    Create a `.env` file in the root directory and add the following variables:
    ```env
    PORT=3000
    MONGO_URI=your_mongodb_uri
    JWT_SECRET=your_jwt_secret
    RABBITMQ_URL=amqp://localhost
    ```

4. **Run the Application**:
    ```bash
    npm start
    ```

The server will start on the port specified in the `.env` file, and you can interact with the REST and GraphQL endpoints as well as the WebSocket service.


For any questions or issues, please feel free to contact me. Thank you for reviewing my submission!
