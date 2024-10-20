// api/index.js

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');

const connection = require('../connection.js');
const adminRoutes = require('../routes/Admin.routes.js');
const serviceRoutes = require('../routes/Service.routes.js');
const userRoutes = require('../routes/User.routes.js');
const tokenRoutes = require('../routes/Token.route.js');
const queueRoutes = require('../routes/Queue.routes.js');

// Load environment variables
dotenv.config({ path: '../.env' });

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));
app.use(cors({
    origin: "https://wait-less.vercel.app",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

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

// Export the app for Vercel to use as a serverless function
module.exports = app;
