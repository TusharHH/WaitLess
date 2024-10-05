const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_admin,
    getUsersInService,
    verifyOtp,
    send_otp,
    sendFeedback,
    getAllAdmins
} = require('../controllers/Admin.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');
const { upload } = require('../middlewares/multer.middleware.js');

const route = express.Router();

route.post('/login', login);
route.post('/signup', upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    }
]), signup);
route.put('/reset-password', reset_password);
route.put('/update-admin', upload.fields([
    {
        name: 'avatar',
        maxCount: 1
    }
]), update_admin);
route.get('/getUsers', getUsersInService);
route.get('/admins', getAllAdmins);
route.post('/verify-otp', verifyOtp);
route.post('/send-otp', send_otp);
route.post('/feedback', sendFeedback);

module.exports = route;
