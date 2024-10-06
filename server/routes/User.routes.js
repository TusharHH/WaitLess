const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_user
} = require('../controllers/User.controller.js');

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

route.put('/update_user/:id', update_user);

module.exports = route;
