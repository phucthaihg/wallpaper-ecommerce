const { User } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get user's profile
 * Lấy thông tin cá nhân của người dùng
 */
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update user profile
 * Cập nhật thông tin cá nhân người dùng
 */
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const user = await User.findByPk(req.user.id);

    await user.update({
      firstName: firstName || user.firstName,
      lastName: lastName || user.lastName,
      phone: phone || user.phone
    });

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update user avatar
 * Cập nhật ảnh đại diện người dùng
 */
exports.updateAvatar = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!req.file) {
      return res.status(400).json({
        message: 'No file uploaded - Không có file được tải lên'
      });
    }

    // Delete old avatar if exists
    // Xóa ảnh đại diện cũ nếu tồn tại
    if (user.avatar) {
      const oldAvatarPath = path.join(__dirname, '../public', user.avatar);
      await fs.unlink(oldAvatarPath).catch(() => {});
    }

    const avatarUrl = `/uploads/avatars/${req.file.filename}`;
    await user.update({ avatar: avatarUrl });

    res.json({
      avatar: avatarUrl,
      message: 'Avatar updated successfully - Cập nhật ảnh đại diện thành công'
    });
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user addresses
 * Lấy danh sách địa chỉ người dùng
 */
exports.getAddresses = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user.addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Add new address for user
 * Thêm địa chỉ mới cho người dùng
 */
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

    // Set as default if first address or requested
    // Đặt làm mặc định nếu là địa chỉ đầu tiên hoặc được yêu cầu
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

/**
 * Update user's address
 * Cập nhật địa chỉ người dùng
 */
exports.updateAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found - Không tìm thấy địa chỉ' });
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
    // Xử lý logic địa chỉ mặc định
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

/**
 * Delete user address
 * Xóa địa chỉ người dùng
 * 
 * @param {string} addressId - Address ID / ID địa chỉ
 */
exports.deleteAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);

    if (addressIndex === -1) {
      return res.status(404).json({ message: 'Address not found - Không tìm thấy địa chỉ' });
    }

    const wasDefault = user.addresses[addressIndex].isDefault;
    user.addresses.splice(addressIndex, 1);

    // If deleted address was default, set new default
    // Nếu địa chỉ bị xóa là mặc định, đặt địa chỉ mặc định mới
    if (wasDefault && user.addresses.length > 0) {
      user.addresses[0].isDefault = true;
    }

    await user.save();
    res.json({ message: 'Address deleted successfully - Xóa địa chỉ thành công' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Set default address
 * Đặt địa chỉ mặc định
 */
exports.setDefaultAddress = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    const addressIndex = user.addresses.findIndex(addr => addr.id === req.params.id);

    if (addressIndex === -1) {
      return res.status(404).json({
        message: 'Address not found - Không tìm thấy địa chỉ'
      });
    }

    user.addresses = user.addresses.map((addr, index) => ({
      ...addr,
      isDefault: index === addressIndex
    }));

    await user.save();
    res.json(user.addresses[addressIndex]);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user preferences
 * Lấy tùy chọn người dùng
 */
exports.getPreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update user preferences
 * Cập nhật tùy chọn người dùng
 */
exports.updatePreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    await user.update({
      preferences: {
        ...user.preferences,
        ...req.body
      }
    });
    res.json(user.preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get all users (admin only)
 * Lấy tất cả người dùng (chỉ admin)
 */
exports.getAllUsers = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      role,
      isActive
    } = req.query;

    const where = {};
    
    if (search) {
      where[Op.or] = [
        { email: { [Op.iLike]: `%${search}%` } },
        { firstName: { [Op.iLike]: `%${search}%` } },
        { lastName: { [Op.iLike]: `%${search}%` } }
      ];
    }

    if (role) where.role = role;
    if (isActive !== undefined) where.isActive = isActive;

    const users = await User.findAndCountAll({
      where,
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] },
      limit: parseInt(limit),
      offset: (page - 1) * limit,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      users: users.rows,
      total: users.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(users.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get user by ID (admin only)
 * Lấy người dùng theo ID (chỉ admin)
 */
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    if (!user) {
      return res.status(404).json({
        message: 'User not found - Không tìm thấy người dùng'
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update user (admin only)
 * Cập nhật người dùng (chỉ admin)
 */
exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found - Không tìm thấy người dùng'
      });
    }

    const allowedUpdates = ['firstName', 'lastName', 'phone', 'role', 'isActive'];
    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    await user.save();

    const updatedUser = await User.findByPk(user.id, {
      attributes: { exclude: ['password', 'resetPasswordToken', 'resetPasswordExpires'] }
    });

    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete user (admin only)
 * Xóa người dùng (chỉ admin)
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    
    if (!user) {
      return res.status(404).json({
        message: 'User not found - Không tìm thấy người dùng'
      });
    }

    if (user.avatar) {
      const avatarPath = path.join(__dirname, '../public', user.avatar);
      await fs.unlink(avatarPath).catch(() => {});
    }

    await user.destroy();
    res.json({
      message: 'User deleted successfully - Xóa người dùng thành công'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Bulk delete users (admin only)
 * Xóa nhiều người dùng (chỉ admin)
 */
exports.bulkDeleteUsers = async (req, res) => {
  try {
    const { ids } = req.body;

    const users = await User.findAll({
      where: { id: { [Op.in]: ids } }
    });

    // Delete avatars
    // Xóa ảnh đại diện
    for (const user of users) {
      if (user.avatar) {
        const avatarPath = path.join(__dirname, '../public', user.avatar);
        await fs.unlink(avatarPath).catch(() => {});
      }
    }

    await User.destroy({
      where: { id: { [Op.in]: ids } }
    });

    res.json({
      message: 'Users deleted successfully - Xóa người dùng thành công'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update user status (admin only)
 * Cập nhật trạng thái người dùng (chỉ admin)
 */
exports.updateUserStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: 'User not found - Không tìm thấy người dùng'
      });
    }

    await user.update({ isActive });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = exports;