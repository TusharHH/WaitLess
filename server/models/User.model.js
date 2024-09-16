const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        trim: true
    },
    notificationsEnabled: {
        type: Boolean,
        default: false
    },
    tokenHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
