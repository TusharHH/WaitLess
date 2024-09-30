const Queue = require('../models/Queue.model.js');
const Token = require('../models/Token.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

// Create a queue for a service
const createQueue = AsyncHandler(async (req, res) => {
    const { serviceId } = req.body;

    // Check if the queue already exists
    const existingQueue = await Queue.findOne({ service: serviceId });
    if (existingQueue) {
        return ApiResponse(res, false, "Queue for this service already exists!", {}, 409);
    }

    // Create a new queue for the service
    const newQueue = new Queue({
        service: serviceId,
        users: [] // Initialize with an empty array of users
    });

    await newQueue.save();
    ApiResponse(res, true, "Queue created successfully!", { newQueue }, 201);
});

// Update a queue: add or remove a user, return queue details
const updateQueue = AsyncHandler(async (req, res) => {
    const { serviceId, userId, tokenId } = req.body;

    // Find the queue for the given service
    let queue = await Queue.findOne({ service: serviceId }).populate('users.user').populate('users.token');
    if (!queue) {
        return ApiResponse(res, false, "Queue for this service not found!", {}, 404);
    }

    // Check if the user is already in the queue
    const userInQueue = queue.users.find(u => u.user.toString() === userId);
    if (userInQueue) {
        return ApiResponse(res, false, "User is already in the queue!", {}, 409);
    }

    // Add user and token to the queue
    queue.users.push({
        user: userId,
        token: tokenId
    });

    await queue.save();

    // Get the user's position and token number
    const currentUserIndex = queue.users.findIndex(u => u.user.toString() === userId);
    const tokenNumber = queue.users[currentUserIndex].token.tokenNumber;
    const usersAhead = currentUserIndex;

    ApiResponse(res, true, "Queue updated successfully!", {
        tokenNumber,
        usersAhead,
        queueLength: queue.users.length
    }, 200);
});

module.exports = {
    createQueue,
    updateQueue
};
