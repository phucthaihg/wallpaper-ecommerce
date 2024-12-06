const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');
const upload = require('../config/multer');

/**
 * Public user routes
 * Các route người dùng công khai
 */
router.get('/verify-email/:token', userController.verifyEmail);

/**
 * Protected user routes - requires authentication
 * Các route người dùng được bảo vệ - yêu cầu xác thực
 */
router.use(authenticate);

// Profile routes / Route hồ sơ cá nhân
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/profile/avatar', upload.single('avatar'), userController.updateAvatar);

// Address routes / Route địa chỉ
router.get('/addresses', userController.getAddresses);
router.post('/addresses', userController.addAddress);
router.put('/addresses/:id', userController.updateAddress);
router.delete('/addresses/:id', userController.deleteAddress);
router.put('/addresses/:id/default', userController.setDefaultAddress);

// Notification preferences / Tùy chọn thông báo
router.get('/preferences', userController.getPreferences);
router.put('/preferences', userController.updatePreferences);

/**
 * Admin routes - requires admin role
 * Route admin - yêu cầu quyền admin
 */
router.use(isAdmin);

// User management / Quản lý người dùng
router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.put('/:id/status', userController.updateUserStatus);

// Bulk operations / Thao tác hàng loạt
router.post('/bulk-delete', userController.bulkDeleteUsers);
router.put('/bulk-status', userController.bulkUpdateStatus);