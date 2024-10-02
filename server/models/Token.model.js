const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    registrationQueuePosition: {
        type: Number,
        required: true
    },
    serviceQueuePosition: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['in_registration', 'in_service_queue', 'completed', 'cancelled'],
        default: 'in_registration'
    },
    queueLength: {
        type: Number,  
        required: true
    },
    estimatedWaitTime: {
        type: Number,  
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);
