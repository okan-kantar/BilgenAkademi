const { body, param } = require('express-validator');
const Category = require('../models/Category');

const categoryIdParamValidator = [
  param('categoryId')
    .isMongoId()
    .withMessage('categoryId gecersiz formatta'),
];

const createCategoryValidator = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Kategori adi zorunludur')
    .isLength({ max: 80 })
    .withMessage('Kategori adi en fazla 80 karakter olabilir')
    .bail()
    .custom(async (name) => {
      const existingCategory = await Category.findOne({ name }).select('_id').lean();

      if (existingCategory) {
        throw new Error('Bu kategori zaten mevcut');
      }

      return true;
    }),

  body('description')
    .optional()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 150 })
    .withMessage('Aciklama en fazla 150 karakter olabilir'),
];

const updateCategoryValidator = [
  ...categoryIdParamValidator,

  body()
    .custom((_, { req }) => {
      const allowedFields = ['name', 'description'];
      const payloadKeys = Object.keys(req.body || {});

      if (!payloadKeys.length) {
        throw new Error('Guncellenecek en az bir alan gondermelisiniz');
      }

      const hasInvalidField = payloadKeys.some((key) => !allowedFields.includes(key));

      if (hasInvalidField) {
        throw new Error('Gecersiz alan gonderdiniz');
      }

      return true;
    }),

  body('name')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Kategori adi bos olamaz')
    .isLength({ max: 80 })
    .withMessage('Kategori adi en fazla 80 karakter olabilir')
    .bail()
    .custom(async (name, { req }) => {
      const existingCategory = await Category.findOne({ name }).select('_id').lean();

      if (
        existingCategory &&
        existingCategory._id.toString() !== req.params.categoryId
      ) {
        throw new Error('Bu kategori adi zaten kullaniliyor');
      }

      return true;
    }),

  body('description')
    .optional()
    .isString()
    .withMessage('Aciklama metin olmalidir')
    .bail()
    .isLength({ max: 150 })
    .withMessage('Aciklama en fazla 150 karakter olabilir'),
];

module.exports = {
  categoryIdParamValidator,
  createCategoryValidator,
  updateCategoryValidator,
};
