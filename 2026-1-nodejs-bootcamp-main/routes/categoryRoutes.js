const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const validate = require('../validators/validate');
const {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
} = require('../validators/categoryValidators');

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *     CategoryInput:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 80
 *         description:
 *           type: string
 *           maxLength: 150
 *     CategoryUpdateInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           maxLength: 80
 *         description:
 *           type: string
 *           maxLength: 150
 */

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Tum kategorileri listeler
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: Basarili kategori listesi
 *       400:
 *         description: Kategori listesi getirilemedi
 *   post:
 *     summary: Yeni kategori olusturur
 *     tags:
 *       - Categories
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryInput'
 *     responses:
 *       201:
 *         description: Kategori basariyla olusturuldu
 *       400:
 *         description: Validasyon hatasi veya kategori zaten mevcut
 */
router.get('/', categoryController.getAllCategories);
router.post('/', createCategoryValidator, validate, categoryController.createNewCategory);

/**
 * @swagger
 * /api/categories/{categoryId}:
 *   put:
 *     summary: Kategori bilgilerini gunceller
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CategoryUpdateInput'
 *     responses:
 *       200:
 *         description: Kategori basariyla guncellendi
 *       400:
 *         description: Validasyon hatasi veya gecersiz veri
 *       404:
 *         description: Kategori bulunamadi
 *   delete:
 *     summary: Kategoriyi siler
 *     tags:
 *       - Categories
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Kategori basariyla silindi
 *       400:
 *         description: Gecersiz categoryId
 *       404:
 *         description: Kategori bulunamadi
 */
router.put('/:categoryId', updateCategoryValidator, validate, categoryController.updateCategory);
router.delete(
  '/:categoryId',
  categoryIdParamValidator,
  validate,
  categoryController.deleteCategory,
);

module.exports = router;
