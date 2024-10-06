const User = require('../models/User.model.js');

const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');
const { uploadOnCloudinary } = require("../utils/cloudinary.js");

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

    let avatar = null;
    if (req.files && req.files.avatar) {
        const avatarFilePath = req.files.avatar[0].path;
        const uploadResponse = await uploadOnCloudinary(avatarFilePath);
        if (uploadResponse.success) {
            avatar = uploadResponse.url;
        } else {
            return ApiResponse(res, false, uploadResponse.message, {}, 500);
        }
    }

    const newUser = new User({ name, email, password, avatar });
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
    const { userId } = req.params;

    // Use req.body to access form-data fields like name, email, password
    const { name, email, password } = req.body;

    // Check if the user exists
    const user = await User.findById(userId);
    if (!user) {
        return ApiResponse(res, false, 'User not found', {}, 404);
    }

    // Update the user's fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (password) user.password = password;

    // Handle file upload (avatar)
    if (req.files && req.files['avatar']) {
        const avatar = req.files['avatar'][0]; // Get the uploaded file
        // Process the avatar upload to Cloudinary or any other storage
        const avatarUrl = await uploadOnCloudinary(avatar.path);
        user.avatar = avatarUrl;
    }

    // Save the updated user
    await user.save();

    ApiResponse(res, true, 'User updated successfully', { user });
});



module.exports = {
    signup,
    login,
    reset_password,
    update_user
};