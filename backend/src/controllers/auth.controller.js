const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

/**
 * Register a new user
 * Đăng ký người dùng mới
 */
exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user exists
        // Kiểm tra người dùng đã tồn tại chưa
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered - Email đã được đăng ký' });
        }

        // Create user
        // Tạo người dùng
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone
        });

        // Generate verification token
        // Tạo mã xác minh
        const verificationToken = user.generateEmailVerificationToken();
        await user.save();

        // Send verification email
        // Gửi email xác minh
        await sendEmail({
            to: user.email,
            subject: 'Verify Your Email - Xác minh Email của bạn',
            template: 'emailVerification',
            context: {
                name: user.firstName,
                verificationUrl: `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`
            }
        });

        // Generate JWT token
        // Tạo token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * User login
 * Đăng nhập người dùng
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user and verify password
        // Tìm người dùng và xác minh mật khẩu
        const user = await User.findOne({ where: { email } });
        if (!user || !await user.validatePassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials - Thông tin đăng nhập không hợp lệ' });
        }

        // Update last login
        // Cập nhật lần đăng nhập cuối
        user.lastLogin = new Date();
        await user.save();

        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Request password reset
 * Yêu cầu đặt lại mật khẩu
 * 
 * @param {string} email - User email / Email người dùng
 */
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found - Không tìm thấy người dùng' });
        }

        // Generate reset token
        // Tạo mã đặt lại mật khẩu
        const resetToken = user.generatePasswordResetToken();
        await user.save();

        // Send reset email
        // Gửi email đặt lại mật khẩu
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request - Yêu cầu đặt lại mật khẩu',
            template: 'passwordReset',
            context: {
                name: user.firstName,
                resetUrl,
                expiryTime: '30 minutes - 30 phút'
            }
        });

        res.json({ message: 'Password reset email sent - Đã gửi email đặt lại mật khẩu' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Reset password using token
 * Đặt lại mật khẩu sử dụng mã token
 * 
 * @param {string} token - Reset token / Mã đặt lại
 * @param {string} newPassword - New password / Mật khẩu mới
 */
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        const user = await User.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired reset token - Mã đặt lại không hợp lệ hoặc đã hết hạn'
            });
        }

        // Reset password
        // Đặt lại mật khẩu
        user.password = newPassword;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send confirmation email
        // Gửi email xác nhận
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Successful - Đặt lại mật khẩu thành công',
            template: 'passwordResetSuccess',
            context: { name: user.firstName }
        });

        res.json({ message: 'Password reset successful - Đặt lại mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Change user password
 * Thay đổi mật khẩu người dùng
 * 
 * @param {string} currentPassword - Current password / Mật khẩu hiện tại
 * @param {string} newPassword - New password / Mật khẩu mới
 */
exports.changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findByPk(req.user.id);

        // Verify current password
        // Xác minh mật khẩu hiện tại
        const isValid = await user.validatePassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect - Mật khẩu hiện tại không đúng' });
        }

        // Update password
        // Cập nhật mật khẩu
        user.password = newPassword;
        await user.save();

        // Send notification email
        // Gửi email thông báo
        await sendEmail({
            to: user.email,
            subject: 'Password Changed - Mật khẩu đã được thay đổi',
            template: 'passwordChanged',
            context: { name: user.firstName }
        });

        res.json({ message: 'Password changed successfully - Thay đổi mật khẩu thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Verify email
 * Xác minh email
 */
exports.verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;

        const user = await User.findOne({
            where: {
                emailVerificationToken: token,
                emailVerificationExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({
                message: 'Invalid or expired verification token - Token không hợp lệ hoặc đã hết hạn'
            });
        }

        user.emailVerified = true;
        user.emailVerificationToken = null;
        user.emailVerificationExpires = null;
        await user.save();

        res.json({
            message: 'Email verified successfully - Xác minh email thành công'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Refresh token
 * Làm mới token
 */
exports.refreshToken = async (req, res) => {
    try {
        const token = jwt.sign(
            { id: req.user.id, role: req.user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Logout
 * Đăng xuất
 */
exports.logout = async (req, res) => {
    try {
        // If you're using token blacklist, add the token here
        // Nếu bạn sử dụng danh sách đen token, thêm token vào đây

        res.json({
            message: 'Logged out successfully - Đăng xuất thành công'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;