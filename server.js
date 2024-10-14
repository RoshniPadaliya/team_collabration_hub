
const express = require('express');
const dotenv = require('dotenv');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const helmet = require('helmet');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');


dotenv.config();


connectDB();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/chat', require('./routes/chatRoutes'));

// Error Handling Middleware
app.use(errorHandler);

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*', // Update this in production to your frontend URL
    methods: ['GET', 'POST'],
  },
});

// Import ChatMessage model
const ChatMessage = require('./models/ChatMessage');
const User = require('./models/User');

// Socket.io connection
io.on('connection', (socket) => {
  console.log('New client connected');

  // Join project-specific room
  socket.on('joinProject', ({ project, token }) => {
    // Optionally, verify token here
    socket.join(project);
    console.log(`User joined project: ${project}`);
  });

  // Handle chat message
  socket.on('chatMessage', async ({ project, userId, message }) => {
    try {
      const chatMessage = await ChatMessage.create({
        project,
        sender: userId,
        message,
      });

      const populatedMessage = await chatMessage.populate('sender', 'name email');

      io.to(project).emit('message', populatedMessage);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// Define PORT
const PORT = process.env.PORT || 5000;

// Start server
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
