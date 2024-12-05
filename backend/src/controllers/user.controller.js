const { User } = require('../models');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('../utils/email');

exports.register = async (req, res) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already registered' });
        }

        // Create user
        const user = await User.create({
            email,
            password,
            firstName,
            lastName,
            phone
        });

        // Generate token
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

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Validate password
        const isValid = await user.validatePassword(password);
        if (!isValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        // Generate token
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

exports.getProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: { exclude: ['password'] }
        });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateProfile = async (req, res) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findByPk(req.user.id);

        user.firstName = firstName || user.firstName;
        user.lastName = lastName || user.lastName;
        user.phone = phone || user.phone;

        await user.save();

        res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Address Management
exports.addAddress = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const newAddress = {
            id: crypto.randomUUID(),
            fullName: req.body.fullName,
            phone: req.body.phone,
            address: req.body.address,
            city: req.body.city,
            province: req.body.province,
            postalCode: req.body.postalCode,
            isDefault: Boolean(req.body.isDefault)
        };

        // If this is the first address or set as default
        if (newAddress.isDefault || user.addresses.length === 0) {
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
            newAddress.isDefault = true;
        }

        user.addresses = [...user.addresses, newAddress];
        await user.save();

        res.status(201).json(newAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateAddress = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);

        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        const updatedAddress = {
            ...user.addresses[addressIndex],
            fullName: req.body.fullName || user.addresses[addressIndex].fullName,
            phone: req.body.phone || user.addresses[addressIndex].phone,
            address: req.body.address || user.addresses[addressIndex].address,
            city: req.body.city || user.addresses[addressIndex].city,
            province: req.body.province || user.addresses[addressIndex].province,
            postalCode: req.body.postalCode || user.addresses[addressIndex].postalCode,
            isDefault: Boolean(req.body.isDefault)
        };

        // Handle default address logic
        if (updatedAddress.isDefault) {
            user.addresses = user.addresses.map(addr => ({
                ...addr,
                isDefault: false
            }));
        }

        user.addresses[addressIndex] = updatedAddress;
        await user.save();

        res.json(updatedAddress);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteAddress = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);

        if (addressIndex === -1) {
            return res.status(404).json({ message: 'Address not found' });
        }

        // If deleting default address, set another as default
        const wasDefault = user.addresses[addressIndex].isDefault;
        user.addresses.splice(addressIndex, 1);

        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        await user.save();
        res.json({ message: 'Address deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Password Management
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');
        user.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes

        await user.save();

        // Send reset email
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

        await sendEmail({
            to: user.email,
            subject: 'Password Reset Request',
            text: `To reset your password, please click the link below:\n\n${resetUrl}\n\nThis link will expire in 30 minutes.`,
            html: `
          <p>To reset your password, please click the link below:</p>
          <a href="${resetUrl}">Reset Password</a>
          <p>This link will expire in 30 minutes.</p>
        `
        });

        res.json({ message: 'Password reset email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.body.token)
            .digest('hex');

        const user = await User.findOne({
            where: {
                resetPasswordToken,
                resetPasswordExpires: { [Op.gt]: Date.now() }
            }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();

        // Send confirmation email
        await sendEmail({
            to: user.email,
            subject: 'Password Reset Successful',
            text: 'Your password has been successfully reset.',
            html: '<p>Your password has been successfully reset.</p>'
        });

        res.json({ message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.changePassword = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);

        // Verify current password
        const isValid = await user.validatePassword(req.body.currentPassword);
        if (!isValid) {
            return res.status(401).json({ message: 'Current password is incorrect' });
        }

        // Update password
        user.password = req.body.newPassword;
        await user.save();

        // Send confirmation email
        await sendEmail({
            to: user.email,
            subject: 'Password Changed',
            text: 'Your password has been successfully changed.',
            html: '<p>Your password has been successfully changed.</p>'
        });

        res.json({ message: 'Password changed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin Methods
exports.getAllUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;

        const users = await User.findAndCountAll({
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
            limit,
            offset,
            order: [['createdAt', 'DESC']]
        });

        res.json({
            users: users.rows,
            total: users.count,
            currentPage: page,
            totalPages: Math.ceil(users.count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update allowed fields
        const allowedUpdates = ['firstName', 'lastName', 'phone', 'role', 'isActive'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                user[field] = req.body[field];
            }
        });

        await user.save();

        res.json({
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            role: user.role,
            isActive: user.isActive
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.destroy(); // Soft delete
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};