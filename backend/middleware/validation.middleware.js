const { body } = require('express-validator');

exports.validateProduct = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Product name must be between 2 and 100 characters'),
  
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  
  body('compareAtPrice')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Compare at price must be a positive number'),
  
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('SKU is required'),
  
  body('stockQuantity')
    .isInt({ min: 0 })
    .withMessage('Stock quantity must be a positive number'),
  
  body('categoryId')
    .isInt()
    .withMessage('Valid category ID is required'),
  
  body('specifications')
    .optional()
    .isObject()
    .withMessage('Specifications must be an object'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array')
];