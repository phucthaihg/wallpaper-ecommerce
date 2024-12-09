const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const sequelize = require('../config/database');

/**
 * User Model
 * 
 * Core user model for authentication and profile management.
 * Mô hình người dùng chính cho xác thực và quản lý thông tin cá nhân.
 */
const User = sequelize.define('User', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    },
    // User's email address, used for login and communications
    // Địa chỉ email của người dùng, dùng để đăng nhập và liên lạc
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // Hashed password
    // Mật khẩu đã được mã hóa
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: false,
    // User's first name
    // Tên của người dùng
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: false,
    // User's last name
    // Họ của người dùng
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      is: /^[0-9]{10,11}$/
    },
    // Phone number in format: 10-11 digits
    // Số điện thoại định dạng: 10-11 chữ số
  },
  role: {
    type: DataTypes.ENUM('customer', 'admin', 'staff'),
    defaultValue: 'customer',
    // User role for authorization:
    // Vai trò người dùng cho phân quyền:
    // - customer: Regular user / Người dùng thông thường
    // - admin: Administrator / Quản trị viên
    // - staff: Staff member / Nhân viên
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    // Account status (active/inactive)
    // Trạng thái tài khoản (hoạt động/không hoạt động)
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true,
    // Last successful login timestamp
    // Thời điểm đăng nhập thành công gần nhất
  },
  addresses: {
    type: DataTypes.JSONB,
    defaultValue: [],
    // Array of delivery addresses with structure:
    // Mảng các địa chỉ giao hàng với cấu trúc:
    // [{
    //   id: string,
    //   fullName: string,    // Recipient name / Tên người nhận
    //   phone: string,       // Contact number / Số điện thoại liên hệ
    //   address: string,     // Street address / Địa chỉ đường phố
    //   city: string,        // City / Thành phố
    //   province: string,    // Province / Tỉnh
    //   postalCode: string,  // Postal code / Mã bưu điện
    //   isDefault: boolean   // Default address flag / Cờ địa chỉ mặc định
    // }]
  },
  resetPasswordToken: {
    type: DataTypes.STRING,
    allowNull: true,
    // Token for password reset process
    // Mã thông báo để đặt lại mật khẩu
  },
  resetPasswordExpires: {
    type: DataTypes.DATE,
    allowNull: true,
    // Expiration time for password reset token
    // Thời gian hết hạn của mã đặt lại mật khẩu
  },
  emailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    // Email verification status
    // Trạng thái xác minh email
  },
  emailVerificationToken: {
    type: DataTypes.STRING,
    allowNull: true,
    // Token for email verification
    // Mã thông báo để xác minh email
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true,
    // URL to user's profile picture
    // URL ảnh đại diện của người dùng
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // User preferences such as:
    // Tùy chọn người dùng như:
    // {
    //   newsletter: boolean,      // Newsletter subscription / Đăng ký nhận bản tin
    //   language: string,         // Preferred language / Ngôn ngữ ưa thích
    //   notifications: {          // Notification settings / Cài đặt thông báo
    //     email: boolean,         // Email notifications / Thông báo qua email
    //     sms: boolean,          // SMS notifications / Thông báo qua SMS
    //     orderUpdates: boolean  // Order status updates / Cập nhật trạng thái đơn hàng
    //   }
    // }
  }
}, {
  timestamps: true,  // Adds createdAt, updatedAt fields / Thêm trường createdAt, updatedAt
  paranoid: true,    // Soft delete / Xóa mềm
  hooks: {
    beforeSave: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 10);
      }
    }
  }
});

// Instance method to check password
// Phương thức kiểm tra mật khẩu
User.prototype.validatePassword = async function(password) {
  return bcrypt.compare(password, this.password);
};

// Method to generate password reset token
// Phương thức tạo mã đặt lại mật khẩu
User.prototype.generatePasswordResetToken = function() {
  this.resetPasswordToken = crypto.randomBytes(32).toString('hex');
  this.resetPasswordExpires = Date.now() + 30 * 60 * 1000; // 30 minutes
  return this.resetPasswordToken;
};

// Method to generate email verification token
// Phương thức tạo mã xác minh email
User.prototype.generateEmailVerificationToken = function() {
  this.emailVerificationToken = crypto.randomBytes(32).toString('hex');
  return this.emailVerificationToken;
};

// Class method to find user by email
// Phương thức tìm người dùng theo email
User.findByEmail = async function(email) {
  return await this.findOne({ where: { email } });
};

// Virtual field for full name
// Trường ảo cho họ tên đầy đủ
User.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = User;