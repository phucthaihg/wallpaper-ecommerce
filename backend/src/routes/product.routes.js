const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

/**
 * Public routes for product viewing
 * Các route công khai để xem sản phẩm
 */
router.get('/', productController.getAllProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/search', productController.searchProducts);
router.get('/:id', productController.getProductById);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/category/:categoryId', productController.getProductsByCategory);

/**
 * Protected routes for product management
 * Các route được bảo vệ để quản lý sản phẩm
 */
router.use(authenticate, isAdmin);

// Create product with multiple images
// Tạo sản phẩm với nhiều hình ảnh
router.post('/', 
  upload.array('images', 5), 
  productController.createProduct
);

// Update product
// Cập nhật sản phẩm
router.put('/:id', 
  upload.array('images', 5), 
  productController.updateProduct
);

router.delete('/:id', productController.deleteProduct);
router.put('/:id/stock', productController.updateStock);
router.post('/bulk-delete', productController.bulkDeleteProducts);

module.exports = router;