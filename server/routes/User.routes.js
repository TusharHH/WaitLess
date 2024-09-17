const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_user
} = require('../controllers/User.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');

const route = express.Router();

route.post('/login', login);
route.post('/signup', signup);
route.put('/reset-password', reset_password);

route.put('/update_user', protect, update_user);

module.exports = route;
