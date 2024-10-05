const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_admin,
    getUsersInService,
    verifyOtp,
    send_otp
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
route.put('/update-admin', protect, update_admin);
route.get('/getUsers', getUsersInService);
route.post('/verify-otp', verifyOtp);
route.post('/send-otp', send_otp);

module.exports = route;
