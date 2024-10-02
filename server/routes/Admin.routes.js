const express = require('express');

const {
    login,
    signup,
    reset_password,
    update_admin,
    getUsersInService
} = require('../controllers/Admin.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');

const route = express.Router();

route.post('/login', login);
route.post('/signup', signup);
route.put('/reset-password', reset_password);
route.put('/update-admin', protect, update_admin);
route.get('/getUsers',getUsersInService);

module.exports = route;
