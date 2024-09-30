const User = require('../models/User.model.js');

const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');

const GenerateToken = require('../middlewares/GenerateToken.middleware.js');

const signup = AsyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return ApiResponse(res, false, "Please fill all the fields!", {}, 400);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        return ApiResponse(res, false, "User already exists!", {}, 409);
    }

    const newUser = new User({ name, email, password });
    const token = GenerateToken(newUser.email);

    newUser.authToken = token;
    await newUser.save();

    ApiResponse(res, true, "User registered successfully!", { newUser }, 201);
});

const login = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    
    if (!email || !password) {
        return ApiResponse(res, false, "Please provide email and password!", {}, 400);
    }

    const user = await User.findOne({ email });
    if (!user) {
        return ApiResponse(res, false, "User not found!", {}, 404);
    }

    const isPasswordValid = await user.validatePassword(password);
    if (!isPasswordValid) {
        return ApiResponse(res, false, "Invalid credentials!", {}, 401);
    }

    const token = GenerateToken(user._id);

    user.authToken = token;
    await user.save();

    ApiResponse(res, true, "Login successful!", { user }, 200);
});

const reset_password = AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return ApiResponse(res, false, "User not found!", {}, 404);
    }

    user.password = password;
    await user.save();

    ApiResponse(res, true, "Password reset successful!", { user }, 200);
});

const update_user = AsyncHandler(async (req, res) => {
    const { id } = req.params;
    const { name, email, password } = req.body;

    const user = await User.findById(id);
    if (!user) {
        return ApiResponse(res, false, 'User not found', {}, 404);
    }

    user.name = name || user.name;
    user.email = email || user.email; await user.save();

    ApiResponse(res, true, 'User updated successfully', { user });
});


module.exports = {
    signup,
    login,
    reset_password,
    update_user
};