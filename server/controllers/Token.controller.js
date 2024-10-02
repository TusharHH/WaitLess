const Token = require('../models/Token.model.js');
const QueueModel = require('../models/Queue.model.js');
const Service = require('../models/Service.model.js');

const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const createToken = AsyncHandler(async (req, res) => {

    const { service_id, user_id } = req.body;

    if (!service_id || !user_id) {
        ApiResponse(res, false, "All feild are mandatory !!", {}, 404);
    }

    const queue = await QueueModel.findOne({ service: service_id });

    if (!queue) {
        ApiResponse(res, false, "No queue found !!", {}, 404);
    }

    const queueLength = queue.users.length;

    const token_number = queueLength + 1;
    const service = await Service.findById(service_id);
    const wait = service.queueDuration;

    const token = await Token.create({
        tokenNumber: token_number,
        user: user_id,
        service: service_id,
        registrationQueuePosition: token_number,
        serviceQueuePosition: token_number,
        queueLength: queueLength,
        estimatedWaitTime: wait * queueLength
    })

    if (!token) {
        ApiResponse(res, false, "Token not created !!", {}, 400);
    }

    ApiResponse(res, true, "Token created succesfully !!", { token, userAhead: queueLength, tokenNumber: queueLength + 1 }, 200);

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
