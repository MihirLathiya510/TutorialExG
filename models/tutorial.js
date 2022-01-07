const mongoose = require('mongoose');

const tutorial = new mongoose.Schema(
  {
    title: {
      type: 'string',
      minlength: 3,
      maxlength: 100,
      required: true,
    },
    description: {
      type: 'string',
      minlength: 1,
      maxlength: 5000,
      required: true,
    },
    published: {
      type: 'boolean',
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('tutorial', tutorial);
