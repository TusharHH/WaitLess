const express = require('express');

const {
    create_service,
    update_service,
    delete_service,
    get_services_with_admin,
    get_all_service
} = require('../controllers/Service.controller.js');

const protect = require('../middlewares/VerifyToken.middleware.js');

const route = express.Router();

route.post('/service', protect, create_service);
route.put('/service/:id', protect, update_service);
route.delete('/service/:id', protect, delete_service);
route.get('/service/:adminId', get_services_with_admin);
route.get('/services', get_all_service);

module.exports = route;