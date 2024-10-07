const mongoose = require('mongoose');

const bcrypt = require('bcryptjs');


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
    avatar: {
        type: String, 
    },
    tokenHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Token'
    }],
    authToken: {
        type: String,
        default: null
    },
    token: {
        type: Number,
        default: null
    }
}, { timestamps: true });


userSchema.statics.hashPassword = async function (password) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
};

userSchema.methods.validatePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await this.constructor.hashPassword(this.password);
    }
    next();
});


module.exports = mongoose.model('User', userSchema);
