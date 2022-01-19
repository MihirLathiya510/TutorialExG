const mongoose = require('mongoose');

const users = new mongoose.Schema(
  {
    username: {
      type: 'string',
      minlength: 6,
      maxlength: 256,
      required: true,
    },
    email: {
      type: 'string',
      minlength: 6,
      maxlength: 256,
      required: true,
    },
    password: {
      type: 'string',
      minlength: 6,
      maxlength: 1024,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('users', users);
