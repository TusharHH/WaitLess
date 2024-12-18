const Admin = require('../models/Admin.model.js');
const { AsyncHandler, ApiResponse } = require('../utils/Helpers.js');
const Service = require('../models/Service.model.js');
const Queue = require('../models/Queue.model.js');
const User = require('../models/User.model.js');
const { v2: cloudinary } = require("cloudinary");


const { uploadOnCloudinary } = require("../utils/cloudinary.js");
const sendMail = require('../middlewares/sendMail.js');
// const cloudinary = require('cloudinary')

const GenerateToken = require('../middlewares/GenerateToken.middleware.js');

const signupOtpTemplate = require('../templates/signupOtpTemplate.js');
const loginOtpTemplate = require('../templates/loginOtpTemplate.js');
const resetPasswordOtpTemplate = require('../templates/resetPasswordOtpTemplate.js');
const { upload } = require('../middlewares/multer.middleware.js');

const sendOtpEmail = async (user, type) => {
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    console.log("Otp :",otp);


    let subject, htmlContent;

    switch (type) {
        case 'signup':
            subject = 'Complete Your Signup - OTP Verification';
            htmlContent = signupOtpTemplate(otp, user.name);
            break;
        case 'login':
            subject = 'Login Verification OTP';
            htmlContent = loginOtpTemplate(otp, user.name);
            break;
        case 'reset-password':
            subject = 'Password Reset OTP';
            htmlContent = resetPasswordOtpTemplate(otp, user.name);
            break;
        default:
            throw new Error('Invalid OTP type');
    }

    await user.save();
    await sendMail(user.email, subject, htmlContent);
};

const signup = AsyncHandler(async (req, res) => {
    const { name, email, password,location } = req.body;

    if (!name || !email || !password ||!location) {
        return ApiResponse(res, false, "Please fill all the fields!", {}, 400);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
        return ApiResponse(res, false, "Admin already exists!", {}, 409);
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


    const newAdmin = new Admin({ name, email, password, avatar,location });
    const token = GenerateToken(newAdmin.email);
    // console.log(token);
    newAdmin.authToken = token;
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

    const adminDetails = await Admin.findById(admin._id)
        .populate({
            path: 'services',
            select: '_id name description slotDuration queueDuration tags',
            populate: {
                path: 'slots',
                select: '_id startTime endTime available'
            }
        })
        .select('-password -authToken');

    admin.authToken = token;
    await admin.save();

    ApiResponse(res, true, "Login successful!", {
        Token: admin.authToken,
        adminDetails
    }, 200);
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
    const { name, email, password,location } = req.body;
    const { adminId } = req.params;

    // Find the admin by ID
    const admin = await Admin.findById(adminId);
    if (!admin) {
        return ApiResponse(res, false, 'Admin not found', {}, 404);
    }


    // Update the admin fields
    admin.name = name || admin.name;
    admin.email = email || admin.email;
    admin.location = location || location;

    if (password) {
        admin.password = password;
    }

    // Check if there's a new avatar to upload
    const avatar = req.file?.path;
    if (avatar) {
        if (admin.avatar) {
            const publicId = admin.avatar.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
        }
        const uploadedAvatar = await uploadOnCloudinary(avatar);
        admin.avatar = uploadedAvatar.url;
    }

    // Save the updated admin
    await admin.save();

    // Fetch the updated admin details with populated fields
    const updatedAdminDetails = await Admin.findById(admin._id)
        .populate({
            path: 'services',
            select: '_id name description slotDuration queueDuration',
            populate: {
                path: 'slots',
                select: '_id startTime endTime available'
            }
        })
        .select('-password -authToken'); // Exclude password and token

    // Return the response with the updated admin details
    ApiResponse(res, true, 'Admin updated successfully', { adminDetails: updatedAdminDetails }, 200);
});


const getUsersInService = async (req, res) => {
    try {
        const { adminId, serviceId } = req.query;

        // Find the admin
        console.log(adminId);
        const admin = await Admin.findById(adminId);
        console.log(admin);

        if (!admin) {
            return ApiResponse(res, false, "Admin not found !!", {}, 404);
        }

        // Check if the admin has the service
        const service = await Service.findOne({ _id: serviceId, admin: adminId });

        if (!service) {
            return ApiResponse(res, false, "Service not found or not owned by this admin", {}, 404);
        }

        // Get the users from the queue for the service
        const queue = await Queue.findOne({ service: serviceId }).populate('users.user').populate('users.token');

        if (!queue || queue.users.length === 0) {
            return res.status(404).json({ message: 'No users found for this service' });
        }

        // Extract users' information
        const users = queue.users.map(entry => ({
            userId: entry.user._id,
            name: entry.user.name,
            email: entry.user.email,
            token: entry.token.tokenNumber,
            status: entry.token.status,
            registrationQueuePosition: entry.token.registrationQueuePosition,
            serviceQueuePosition: entry.token.serviceQueuePosition
        }));

        return res.status(200).json({
            message: `Users for service: ${service.name}`,
            users
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

const send_otp = AsyncHandler(async (req, res) => {

    const { email, type } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required.' });

    const user = await Admin.findOne({ email });
    if (!user) return res.status(400).json({ message: 'User not found.' });

    await sendOtpEmail(user, type);

    res.json({ message: `OTP sent for ${type}.` });
});

const verifyOtp = AsyncHandler(async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) return res.status(400).json({ message: 'Email and OTP are required.' });

    console.log(otp);
    const user = await Admin.findOne({ email });
    console.log(user.otp);
    if (!user) return res.status(400).json({ message: 'User not found.' });
    if (user.otp != otp) return res.status(400).json({ message: 'Invalid OTP.' });



    user.otp = null;
    await user.save();

    res.json({ message: 'OTP verified successfully.' });
});

const sendFeedback = AsyncHandler(async (req, res) => {
    const { senderId, senderType, feedbackMessage } = req.body;

    if (!senderId || !senderType || !feedbackMessage) {
        return ApiResponse(res, false, 'Sender ID, sender type, and feedback message are required.', {}, 400);
    }

    let sender;
    let senderName;
    let senderEmail;

    if (senderType === 'admin') {
        sender = await Admin.findById(senderId);
        if (!sender) {
            return ApiResponse(res, false, 'Admin not found.', {}, 404);
        }
        senderName = sender.name;
        senderEmail = sender.email;
    } else if (senderType === 'user') {
        sender = await User.findById(senderId);
        if (!sender) {
            return ApiResponse(res, false, 'User not found.', {}, 404);
        }
        senderName = sender.name;
        senderEmail = sender.email;
    } else {
        return ApiResponse(res, false, 'Invalid sender type. Must be either "admin" or "user".', {}, 400);
    }


    const subject = `Feedback from ${senderType === 'admin' ? 'Admin' : 'User'}: ${senderName}`;
    const htmlContent = `
        <h2>Feedback from ${senderName} (${senderEmail})</h2>
        <p>${feedbackMessage}</p>
    `;

    try {
        const supportEmail = "tusharhhasule99@gmail.com";
        await sendMail(supportEmail, subject, htmlContent);

        return ApiResponse(res, true, 'Feedback sent successfully.', {}, 200);
    } catch (error) {
        console.error('Error sending feedback:', error);
        return ApiResponse(res, false, 'Failed to send feedback.', {}, 500);
    }
});

const getAllAdmins = AsyncHandler(async (req, res) => {

    const admins = await Admin.find()
        .populate({
            path: 'services',
            select: '_id name description slotDuration queueDuration',
            populate: {
                path: 'slots',
                select: '_id startTime endTime available'
            }
        });

    if (!admins) {
        ApiResponse(res, false, "Something went wrong !!", {}, 400);
    }

    ApiResponse(res, true, "Admins Send successfully !!", { admins }, 200);

});

const deleteAdmin = AsyncHandler(async (req, res) => {
    const { id } = req.params;

    const admin = await Admin.findById(id);
    if (!admin) {
        return ApiResponse(res, false, 'Admin not found.', {}, 404);
    }

    if (admin.avatar) {
        const publicId = admin.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
    }

    await admin.deleteOne();

    ApiResponse(res, true, 'Admin deleted successfully.', {}, 200);
});

const getAdminById = AsyncHandler(async(req,res)=>{
    const {adminId}=req.params;

    const admin = await Admin.findById(adminId)
    .populate({
        path: 'services',
        select: '_id name description slotDuration queueDuration tags',
        populate: {
            path: 'slots',
            select: '_id startTime endTime available'
        }
    })
    .select('-password -authToken');

    ApiResponse(res, true, "Admin Fetched successfully !!", {
        Token: admin.authToken,
        admin,
    }, 200);
})

module.exports = {
    login,
    signup,
    reset_password,
    update_admin,
    getUsersInService,
    send_otp,
    verifyOtp,
    sendFeedback,
    getAllAdmins,
    deleteAdmin,
    getAdminById,
};
