const express = require('express');

const {
    create_service,
    update_service,
    delete_service,
    get_services_with_admin
} = require('../controllers/Service.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');

const route = express.Router();

route.post('/service', protect, create_service);
route.put('/service/:id', protect, update_service);
route.delete('/service/:id', protect, delete_service);
route.get('/services', protect, get_services_with_admin);

module.exports = route;
