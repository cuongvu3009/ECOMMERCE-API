const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const UserSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide name'],
    maxlength: 50,
    minlength: 4,
  },
  email: {
    type: String,
    required: [true, 'Please provide email'],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please provide valid email',
    },
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user',
  },
});

UserSchema.pre('save', async function (next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = function (userPassword) {
  return bcrypt.compare(userPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
