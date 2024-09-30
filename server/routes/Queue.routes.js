const express = require('express');
const { createQueue, updateQueue } = require('../controllers/Queue.controller.js');
const { protect } = require('../middlewares/VerifyToken.middleware.js');

const router = express.Router();

// Create a new queue for a service (admin operation)
router.post('/create', createQueue);

// Update the queue (add user, get queue details)
router.put('/update',  updateQueue);

module.exports = router;
