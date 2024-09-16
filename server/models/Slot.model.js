const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    availableTokens: {
        type: Number,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
