const Admin = require('../models/Admin.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const GenerateToken = require('../middlewares/GenerateToken.middleware.js');

const signup = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return ApiResponse(res, false, "Please fill all the fields!", {}, 400);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return ApiResponse(res, false, "Admin already exists!", {}, 409);
    }

    const newAdmin = new Admin({ name, email, password });
    await newAdmin.save();

    ApiResponse(res, true, "Admin registered successfully!", { newAdmin }, 201);
});

const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return ApiResponse(res, false, "Please provide email and password!", {}, 400);
    }

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return ApiResponse(res, false, "Admin not found!", {}, 404);
    }

    const isPasswordValid = await admin.validatePassword(password);
    if (!isPasswordValid) {
        return ApiResponse(res, false, "Invalid credentials!", {}, 401);
    }

    const token = GenerateToken(admin._id);

    admin.authToken = token;
    await admin.save();

    ApiResponse(res, true, "Login successful!", { Token: admin.authToken, admin }, 200);
});

const reset_password = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
        return ApiResponse(res, false, "Admin not found!", {}, 404);
    }

    admin.password = password;
    await admin.save();

    ApiResponse(res, true, "Password reset successful!", { admin }, 200);
});

const update_admin = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const admin = await Admin.findById(id);
    if (!admin) {
        return ApiResponse(res, false, 'Admin not found', {}, 404);
    }

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    await admin.save();

    ApiResponse(res, true, 'Admin updated successfully', { admin });
});

module.exports = {
    login,
    signup,
    reset_password,
    update_admin
};
