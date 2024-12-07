/**
 * Cart routes configuration
 * Cấu hình các route giỏ hàng
 */
const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes / Route công khai
router.get('/', cartController.getCart); // Get current cart / Lấy giỏ hàng hiện tại
router.post('/', cartController.addToCart); // Add to cart / Thêm vào giỏ
router.put('/items/:id', cartController.updateCartItem); // Update item / Cập nhật sản phẩm
router.delete('/items/:id', cartController.removeCartItem); // Remove item / Xóa sản phẩm
router.delete('/', cartController.clearCart); // Clear cart / Xóa toàn bộ giỏ hàng
router.post('/coupon', cartController.applyCoupon); // Apply coupon / Áp dụng mã giảm giá
router.delete('/coupon', cartController.removeCoupon); // Remove coupon / Xóa mã giảm giá
router.get('/summary', cartController.getCartSummary); // Get summary / Lấy tổng quan giỏ hàng

// Protected routes / Route cần xác thực
router.use(authenticate);
router.post('/merge', cartController.mergeCarts); // Merge carts / Gộp giỏ hàng
router.post('/items/:id/save', cartController.saveForLater); // Save for later / Lưu để mua sau
router.post('/items/:id/move', cartController.moveToCart); // Move to cart / Chuyển vào giỏ hàng

module.exports = router;