const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const validate = require('../validators/validate');
const {
  createProductValidator,
  productIdParamValidator,
  getProductsByCategoriesValidator,
  updateProductValidator,
} = require('../validators/productValidators');

router.get('/',  productController.getAllProducts);
router.get(
  '/by-categories',
  getProductsByCategoriesValidator,
  validate,
  productController.getProductsByCategories,
);
router.post('/', createProductValidator, validate, productController.createNewProduct);
router.put('/:productId', updateProductValidator, validate, productController.updateProduct);
router.delete(
  '/:productId',
  productIdParamValidator,
  validate,
  productController.deleteProduct,
);

module.exports = router;
