const express = require('express');

const { create_service } = require('../controllers/Service.controller.js');

const route = express.Router();

route.post('/service', create_service);

module.exports = route;
