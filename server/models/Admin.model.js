const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String, 
  },
  location: {
    type: String,
  },
  services: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service'
  }],
  authToken: {
    type: String,
  },
  otp:{
    type: Number,
  }
}, { timestamps: true });

adminSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

adminSchema.methods.validatePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

adminSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await this.constructor.hashPassword(this.password);
  }
  next();
});

module.exports = mongoose.model('Admin', adminSchema);
