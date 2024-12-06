const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const authController = require('../controllers/auth.controller');

/**
 * Authentication routes
 * Các route xác thực
 */
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
router.post('/verify-email/:token', authController.verifyEmail);

/**
 * Protected authentication routes
 * Các route xác thực được bảo vệ
 */
router.use(authenticate);
router.post('/change-password', authController.changePassword);
router.get('/refresh-token', authController.refreshToken);
router.post('/logout', authController.logout);

module.exports = router;
