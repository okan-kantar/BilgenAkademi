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
const { verifyAccessToken } = require('../middleware/auth');
const { authorizeRoles } = require('../middleware/roles');

router.get(
  '/',
  verifyAccessToken,
  authorizeRoles('admin'),
  productController.getAllProducts,
);
router.get(
  '/by-categories',
  getProductsByCategoriesValidator,
  validate,
  productController.getProductsByCategories,
);

router.post(
  '/',
  verifyAccessToken,
  authorizeRoles('admin'),
  createProductValidator,
  validate,
  productController.createNewProduct,
);

router.put(
  '/:productId',
  verifyAccessToken,
  authorizeRoles('user'),
  updateProductValidator,
  validate,
  productController.updateProduct,
);
router.delete(
  '/:productId',
  verifyAccessToken,
  authorizeRoles('admin', 'user'),
  productIdParamValidator,
  validate,
  productController.deleteProduct,
);

module.exports = router;
