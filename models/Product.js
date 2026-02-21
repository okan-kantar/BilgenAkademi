const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ürün adı zorunludur!'], // Validasyon
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: [0, 'Fiyat negatif olamaz.'],
    },
    category: {
      type: String,
      enum: ['Elektronik', 'Giyim', 'Gıda'], // Sadece bu değerler kabul edilir
      default: 'Gıda',
    },
    description: {
      type: String,
      max: 100,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    tags: {
      type: [String], // ["asdasd", "12312"]
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

module.exports = mongoose.model('Product', productSchema); // products
