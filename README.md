# Chat Application

A real-time chat application built using the MERN stack that allows users to register, log in, communicate with other users, and exchange messages instantly. The application also includes typing indicators, message timestamps, delivery status, read receipts, and emoji support.

## 🚀 Tech Stack

**Frontend**
- React.js
- JavaScript
- Bootstrap
- CSS
- Axios
- Socket.IO Client
- Emoji Picker

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- Socket.IO
- JWT (JSON Web Token)
- bcrypt

## ✨ Features Implemented

### 1. User Authentication
- User registration with username and password.
- Password hashing using bcrypt.
- User login with credential validation.
- JWT token generation during registration and login.

### 2. User Management
- Fetches the list of registered users.
- Displays available users in the chat sidebar.
- Excludes the currently logged-in user from the chat list.
- Allows users to select another user to start a conversation.

### 3. Real-Time Messaging
- Send and receive messages instantly using Socket.IO.
- Messages are saved in MongoDB.
- Fetches previous conversation history when selecting a user.
- Displays messages based on sender and receiver.
- Automatically updates the conversation when a new message arrives.

### 4. Typing Indicator
- Displays a typing indicator when another user is typing.
- Uses Socket.IO events to notify the receiver.
- Hides the indicator when the user stops typing.

### 5. Message Status
- Tracks message delivery and read status.
- Displays single and double tick indicators.
- Updates message status when the receiver receives or reads a message.

### 6. Message Timestamps
- Displays the time when each message was sent.
- Uses timestamps generated through Mongoose.

### 7. Emoji Support
- Integrated emoji picker.
- Allows users to select and insert emojis into the message input field.

## 🔄 Application Workflow

1. A user registers or logs in.
2. The application fetches the list of other registered users.
3. The user selects a person from the chat list.
4. Previous messages between the selected users are fetched from MongoDB.
5. Socket.IO establishes real-time communication between users.
6. Users can send messages, see typing indicators, and track message status.
7. Messages are stored in MongoDB and remain available when the conversation is reopened.

## ⚙️ Backend API Reference

| Method | Endpoint | Description |
|---|---|---|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | Authenticate an existing user |
| GET | `/users?currentUser=username` | Fetch all users except the logged-in user |
| GET | `/messages?sender=username&receiver=username` | Fetch conversation history |

## 🔌 Socket.IO Events

| Event | Description |
|---|---|
| `register_user` | Registers a connected user and joins their room |
| `send_message` | Sends and saves a new message |
| `message_sent` | Confirms message creation to the sender |
| `receive_message` | Delivers a message to the receiver |
| `typing` | Notifies the receiver that the sender is typing |
| `stop_typing` | Notifies the receiver that the sender stopped typing |
| `user_typing` | Receives the typing notification |
| `user_stop_typing` | Receives the stop-typing notification |
| `message_delivered` | Updates message delivery status |
| `message_read` | Updates message read status |
| `message_status` | Sends updated status to the sender |

## 📁 Project Structure

### Backend

```text
backend/
│
├── db/
│   └── db.connect.js
│
├── models/
│   ├── user.model.js
│   └── messages.model.js
│
├── routes/
│   └── auth.js
│
├── index.js
├── package.json
└── .env
```

### Frontend

```text
frontend/
│
├── public/
│
├── src/
│   ├── components/
│   │   ├── Chat.js
│   │   └── MessageList.js
│   │
│   ├── App.js
│   ├── App.css
│   ├── index.js
│   └── index.css
│
├── package.json
└── .env
```

## 🛠️ Installation and Setup

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm start
```

### 3. Frontend Setup

```bash
cd frontend
npm install
```

Configure the backend URL used by the frontend API and Socket.IO connections.

For local development:

```text
http://localhost:5001
```

Start the React application:

```bash
npm start
```

The application will run at:

```text
http://localhost:3000
```

## 📚 Learning Highlights

- Implemented real-time communication using Socket.IO.
- Learned how to create and manage individual user rooms for private messaging.
- Integrated JWT authentication and password hashing using bcrypt.
- Worked with MongoDB to store users and messages with timestamps.
- Implemented typing indicators, message delivery status, and read receipts using socket events.
- Integrated a third-party emoji picker into a React application.
- Practiced handling real-time events, asynchronous API calls, and frontend state management.

## 🌐 Deployment

- Frontend: (https://chat-application-topaz-psi.vercel.app/)
- Backend: (https://chatapplicationbackend-delta.vercel.app/)

## Repository

- Frontend: https://github.com/rashmiw333/Chat-Application
- Backend: https://github.com/rashmiw333/Chat-Application-Backend


## 👩‍💻 Contact

For bugs or feature requests, please reach out to:

rashmiwankhade99@gmail.com
