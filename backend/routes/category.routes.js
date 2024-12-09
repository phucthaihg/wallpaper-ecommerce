const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

/**
 * Public routes for retrieving categories
 * Các route công khai để lấy thông tin danh mục
 */
router.get('/', categoryController.getAllCategories);
router.get('/tree', categoryController.getCategoryTree);
router.get('/slug/:slug', categoryController.getCategoryBySlug);
router.get('/:id', categoryController.getCategoryById);
router.get('/:id/products', categoryController.getCategoryProducts);

/**
 * Admin routes for category management
 * Các route quản lý danh mục dành cho admin
 */
router.use(authenticate, isAdmin);

router.post('/', 
  upload.single('image'),
  categoryController.createCategory
);

router.put('/:id', 
  upload.single('image'),
  categoryController.updateCategory
);

router.delete('/:id', categoryController.deleteCategory);
router.put('/:id/order', categoryController.updateDisplayOrder);
router.post('/bulk-delete', categoryController.bulkDeleteCategories);



module.exports = router;