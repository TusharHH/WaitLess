const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_user
} = require('../controllers/User.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');
const { upload } = require('../middlewares/multer.middleware.js'); // Import multer middleware
const route = express.Router();

route.post('/login', login);
route.post('/signup', upload.fields([ // Add upload fields for signup
    {
        name: 'avatar',  // Handle avatar upload
        maxCount: 1
    }
]), signup);
route.put('/reset-password', reset_password);

route.put('/update_user', protect, update_user);

module.exports = route;
