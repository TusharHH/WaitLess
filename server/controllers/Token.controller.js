const Token = require('../models/Token.model.js');
const Service = require('../models/Service.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const createToken = AsyncHandler(async (req, res) => {
    const { tokenNumber, registrationQueuePosition, serviceQueuePosition, serviceId } = req.body;

    // Extract user from header (assuming it's populated by an authentication middleware)
    const user = req.user;

    if (!tokenNumber || !serviceId || !registrationQueuePosition || !serviceQueuePosition) {
        return ApiResponse(res, false, "Please provide all required fields!", {}, 400);
    }

    const existingToken = await Token.findOne({ tokenNumber });
    if (existingToken) {
        return ApiResponse(res, false, "Token with this number already exists!", {}, 409);
    }

    // Fetch the service to calculate queue information
    const service = await Service.findById(serviceId);
    if (!service) {
        return ApiResponse(res, false, "Service not found!", {}, 404);
    }

    // Aggregation pipeline to calculate queue length and estimate wait time
    const tokensAhead = await Token.aggregate([
        { $match: { service: service._id, status: 'in_service_queue' } },
        { $group: { _id: null, queueLength: { $sum: 1 } } }
    ]);

    const queueLength = tokensAhead.length ? tokensAhead[0].queueLength : 0;
    const estimatedWaitTime = (queueLength + 1) * service.queueDuration;  // +1 to include the current user

    const newToken = new Token({
        tokenNumber,
        registrationQueuePosition,
        serviceQueuePosition,
        user,
        service: service._id,
        queueLength,
        estimatedWaitTime
    });

    await newToken.save();
    ApiResponse(res, true, "Token created successfully!", { newToken }, 201);
});

const getAllTokens = AsyncHandler(async (req, res) => {
    const tokens = await Token.find().populate('service').populate('user');
    ApiResponse(res, true, "Tokens retrieved successfully!", { tokens }, 200);
});

const getTokenById = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return ApiResponse(res, false, "User ID not provided!", {}, 400);
    }

    const token = await Token.findOne({ user: id }).populate('service').populate('user');

    if (!token) {
        return ApiResponse(res, false, "No token found for this user!", {}, 404);
    }

    ApiResponse(res, true, "Token retrieved successfully!", { token }, 200);
});


const updateToken = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { tokenNumber, service, user, registrationQueuePosition, serviceQueuePosition, status } = req.body;

    const token = await Token.findById(id);
    if (!token) {
        return ApiResponse(res, false, "Token not found!", {}, 404);
    }

    token.tokenNumber = tokenNumber || token.tokenNumber;
    token.service = service || token.service;
    token.user = user || token.user;
    token.registrationQueuePosition = registrationQueuePosition || token.registrationQueuePosition;
    token.serviceQueuePosition = serviceQueuePosition || token.serviceQueuePosition;
    token.status = status || token.status;

    await token.save();
    ApiResponse(res, true, "Token updated successfully!", { token }, 200);
});

const deleteToken = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const token = await Token.findByIdAndDelete(id);
    if (!token) {
        return ApiResponse(res, false, "Token not found!", {}, 404);
    }

    ApiResponse(res, true, "Token deleted successfully!", {}, 200);
});

module.exports = {
    createToken,
    getAllTokens,
    getTokenById,
    updateToken,
    deleteToken
};
