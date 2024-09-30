const mongoose = require('mongoose');

const queueSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    users: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            token: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Token',
                required: true
            }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Queue', queueSchema);
