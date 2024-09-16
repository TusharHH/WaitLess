const AsyncHandler = (func) => {
    return async (req, res, next) => {
        try {
            await func(req, res, next);
        } catch (error) {
            next(error);
        }
    }
}

const ApiResponse = (res, success = true, message = '', data = {}, statusCode = 200) => {
    const response = {
        success,
        message,
        data
    };

    return res.status(statusCode).json(response);
};

module.exports = {
    AsyncHandler,
    ApiResponse
};
