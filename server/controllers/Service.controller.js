const Service = require('../models/Service.model.js');

const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const create_service = AsyncHandler(async (req, res) => {

    const { name, description, slots, slotDuration, queueDuration } = req.body;

    if (!name || !slots || !slotDuration || !queueDuration) {
        return ApiResponse(res, false, 'All fields are required', 400);
    }

    const exisitngService = await Service.findOne({ name });
    if (exisitngService) {
        return ApiResponse(res, false, 'Service with this name already exists', 409);
    }

    const newService = new Service({
        name,
        description,
        slots,
        slotDuration,
        queueDuration
    });
    await newService.save();


    ApiResponse(res, true, 'Service created successfully', newService);
});

module.exports = {
    create_service
}