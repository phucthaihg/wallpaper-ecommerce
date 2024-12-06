const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes / Route công khai
router.get('/cart', cartController.getCart); // Get current cart / Lấy giỏ hàng hiện tại
router.post('/cart', cartController.addToCart); // Add to cart / Thêm vào giỏ
router.put('/cart/items/:id', cartController.updateCartItem); // Update item / Cập nhật mặt hàng
router.delete('/cart/items/:id', cartController.removeCartItem); // Remove item / Xóa mặt hàng

// Protected routes / Route được bảo vệ 
router.use(authenticate);
router.get('/carts', cartController.getUserCarts); // Get user's carts / Lấy giỏ hàng của người dùng
router.post('/cart/merge', cartController.mergeCarts); // Merge carts / Gộp giỏ hàng

module.exports = router;