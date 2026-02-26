const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },

    token: {
      type: String,
      required: true,
      index: true,
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now,
      expires: '7d',
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  },
);

module.exports = mongoose.model('RefreshToken', refreshTokenSchema); // categories
