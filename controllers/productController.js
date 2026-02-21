const Product = require('../models/Product');

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();

    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true },
    );

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: 'Ürün bulunamadı' });
    }

    res.json({ success: true, message: 'Ürün silindi' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createNewProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);

    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllProducts,
  createNewProduct,
  updateProduct,
  deleteProduct,
};
