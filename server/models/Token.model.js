const mongoose = require('mongoose');

const tokenSchema = new mongoose.Schema({
    tokenNumber: {
        type: String,
        required: true,
        unique: true
    },
    slot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Slot',
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
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
    qrCode: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Token', tokenSchema);
