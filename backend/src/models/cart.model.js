/**
 * Cart and CartItem models
 * Model Giỏ hàng và Chi tiết giỏ hàng
 */
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Cart = sequelize.define('Cart', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    // Unique identifier for cart
    // Định danh duy nhất cho giỏ hàng
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Users',
      key: 'id'
    },
    // Reference to user if logged in
    // Tham chiếu đến người dùng nếu đã đăng nhập
  },
  sessionId: {
    type: DataTypes.STRING,
    allowNull: true,
    // Session ID for guest carts
    // ID phiên cho giỏ hàng khách
  },
  status: {
    type: DataTypes.ENUM('active', 'merged', 'abandoned', 'converted'),
    defaultValue: 'active',
    // Cart status
    // Trạng thái giỏ hàng
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
    // Expiration timestamp
    // Thời gian hết hạn
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // Additional cart data
    // Dữ liệu bổ sung của giỏ hàng
  }
});

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  cartId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Carts',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    // Product quantity in cart
    // Số lượng sản phẩm trong giỏ
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    // Price when added to cart
    // Giá tại thời điểm thêm vào giỏ
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // Product specifications
    // Thông số sản phẩm
  }
});

module.exports = { Cart, CartItem };