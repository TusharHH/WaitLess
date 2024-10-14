const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const http = require('http'); // Required for setting up the server with socket.io
const { Server } = require('socket.io');

const connection = require('./connection.js');
const adminRoutes = require('./routes/Admin.routes.js');
const serviceRoutes = require('./routes/Service.routes.js');
const userRoutes = require('./routes/User.routes.js');
const tokenRoutes = require('./routes/Token.route.js');
const queueRoutes = require('./routes/Queue.routes.js');

const app = express();
dotenv.config({ path: '.env' });

app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

connection();

app.use(cors({
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type'],
    optionsSuccessStatus: 200,
}));
app.use(express.json({extended:true}));

app.use('/api/v1/admins', adminRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/services', serviceRoutes);
app.use('/api/v1/tokens', tokenRoutes);
app.use('/api/v1/queues', queueRoutes);

// Create HTTP server and integrate with Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'https://wait-less.vercel.app', // Update this based on your needs in a production environment
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
server.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
