const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

router.get('/',  productController.getAllProducts);
router.get('/by-categories', productController.getProductsByCategories);
router.post('/', productController.createNewProduct);
router.put('/:productId', productController.updateProduct);
router.delete('/:productId', productController.deleteProduct);

module.exports = router;
