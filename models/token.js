const mongoose = require('mongoose');

const token = new mongoose.Schema(
  {
    email: {
      type: 'string',
      minlength: 6,
      maxlength: 256,
      required: true,
    },
    otp: {
      type: 'string',
      minlength: 6,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('token', token);
