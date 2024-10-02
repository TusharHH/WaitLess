const Token = require('../models/Token.model.js');
const Service = require('../models/Service.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const createToken = AsyncHandler(async (req, res) => {
    // find service with service id 
    // check if service has any queue
    // find the last count of the queue
    // create a token number queue count + 1
    // queue create kardena aur ussme user add kardena 

    const { serviceId, user } = req.body;
    



































    // tushar

    


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
