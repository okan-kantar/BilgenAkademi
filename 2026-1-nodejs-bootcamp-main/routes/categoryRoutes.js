const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validate = require('../validators/validate');
const {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidators');

router.get('/', categoryController.getAllCategories);
router.post('/', createCategoryValidator, validate, categoryController.createNewCategory);
router.put('/:categoryId', updateCategoryValidator, validate, categoryController.updateCategory);
router.delete(
  '/:categoryId',
  categoryIdParamValidator,
  validate,
  categoryController.deleteCategory,
);

module.exports = router;
