const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur!'], // Validasyon
      trim: true,
      unique: true,
    },

    description: {
      type: String,
      max: 150,
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true, // createdAt ve updatedAt otomatik eklenir
  },
);

module.exports = mongoose.model('Category', categorySchema); // categories
