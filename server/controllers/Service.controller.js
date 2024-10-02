const Service = require('../models/Service.model.js');
const Admin = require('../models/Admin.model.js');

const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const create_service = AsyncHandler(async (req, res) => {
    const { name, description, slots, slotDuration, queueDuration } = req.body;
    const adminId = req.admin._id;

    if (!name || !slots || !slotDuration || !queueDuration) {
        return ApiResponse(res, false, 'All fields are required', 400);
    }

    const existingService = await Service.findOne({ name });
    if (existingService) {
        return ApiResponse(res, false, 'Service with this name already exists', 409);
    }

    const newService = new Service({
        name,
        description,
        slots,
        slotDuration,
        queueDuration,
        admin: adminId
    });

    await newService.save();

    await Admin.findByIdAndUpdate(adminId, {
        $push: { services: newService._id }
    });

    ApiResponse(res, true, 'Service created successfully', newService);
});

const update_service = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, description, slots, slotDuration, queueDuration } = req.body;

    const service = await Service.findById(id);
    if (!service) {
        return ApiResponse(res, false, 'Service not found', {}, 404);
    }

    service.name = name || service.name;
    service.description = description || service.description;
    service.slots = slots || service.slots;
    service.slotDuration = slotDuration || service.slotDuration;
    service.queueDuration = queueDuration || service.queueDuration;

    await service.save();

    ApiResponse(res, true, 'Service updated successfully', service);
});

const get_services_with_admin = AsyncHandler(async (req, res) => {
    const services = await Service.aggregate([
        {
            $lookup: {
                from: 'admins',
                localField: 'admin',
                foreignField: '_id',
                as: 'adminDetails'
            }
        },
        {
            $unwind: '$adminDetails'
        },
        {
            $project: {
                name: 1,
                description: 1,
                slots: 1,
                slotDuration: 1,
                queueDuration: 1,
                adminDetails: {
                    _id: 1,
                    name: 1,
                    email: 1
                }
            }
        }
    ]);

    ApiResponse(res, true, 'Services with admin details fetched successfully', services);
});

const get_all_service = AsyncHandler(async (req, res) => {
    // Fetch services and populate the admin details (name and email)
    const services = await Service.find().populate('admin', 'name email');

    if (!services || services.length === 0) {
        return ApiResponse(res, false, 'No service found !!');
    }

    ApiResponse(res, true, 'Service sent successfully !!', services);
});


const delete_service = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const service = await Service.findByIdAndDelete(id);
    if (!service) {
        return ApiResponse(res, false, 'Service not found', 404);
    }

    ApiResponse(res, true, 'Service deleted successfully');
});

module.exports = {
    create_service,
    update_service,
    get_services_with_admin,
    get_all_service,
    delete_service
};