const Category = require('../models/Category');

const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();

    res.json({ success: true, count: categories.length, data: categories });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.categoryId,
      req.body,
      { new: true },
    );

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Kategori bulunamadi' });
    }

    res.json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: 'Kategori bulunamadi' });
    }

    res.json({ success: true, message: 'Kategori silindi' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const createNewCategory = async (req, res) => {
  try {
    const category = await Category.create(req.body);

    res.status(201).json({ success: true, data: category });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getAllCategories,
  createNewCategory,
  updateCategory,
  deleteCategory,
};
