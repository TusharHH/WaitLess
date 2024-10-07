// server.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');

const connection = require('./connection.js');
const adminRoutes = require('./routes/Admin.routes.js');
const serviceRoutes = require('./routes/Service.routes.js');
const userRoutes = require('./routes/User.routes.js');
const tokenRoutes = require('./routes/Token.route.js');
const queueRoutes = require('./routes/Queue.routes.js');

const app = express();
dotenv.config({ path: '.env' });

// Middleware
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cors());
app.use(express.json({ extended: true }));

// Database connection
connection();

// Define your API routes
app.get('/api/hello', (req, res) => {
  res.status(200).json({ message: 'Hello from Vercel!' });
});

app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/queues', queueRoutes);

// Create HTTP server and integrate with Socket.IO for local development
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Update this based on your needs in a production environment
    credentials: true
  },
});

// Socket.IO event handling
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Handle incoming chat message
  socket.on('message', (msg) => {
    console.log('Message received:', msg);
    // Broadcast the message to all users
    io.emit('message', msg);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start the server
const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
