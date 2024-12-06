/**
 * Cart and CartItem migrations
 * Migration cho Giỏ hàng và Chi tiết giỏ hàng
 */
module.exports = {
    up: async (queryInterface, Sequelize) => {
      // Create Cart table
      // Tạo bảng Giỏ hàng
      await queryInterface.createTable('Carts', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true,
          // Unique identifier for cart
          // Định danh duy nhất cho giỏ hàng
        },
        userId: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          },
          // Reference to user if logged in
          // Tham chiếu đến người dùng nếu đã đăng nhập
        },
        sessionId: {
          type: Sequelize.STRING,
          allowNull: true,
          // Session ID for guest carts
          // ID phiên cho giỏ hàng khách
        },
        status: {
          type: Sequelize.ENUM('active', 'merged', 'abandoned', 'converted'),
          defaultValue: 'active',
          // Cart status:
          // Trạng thái giỏ hàng:
          // - active: Currently in use / Đang sử dụng
          // - merged: Merged with user cart / Đã gộp với giỏ hàng người dùng
          // - abandoned: Expired or abandoned / Đã hết hạn hoặc bị bỏ
          // - converted: Converted to order / Đã chuyển thành đơn hàng
        },
        expiresAt: {
          type: Sequelize.DATE,
          allowNull: false,
          // Expiration time for cart
          // Thời gian hết hạn của giỏ hàng
        },
        metadata: {
          type: Sequelize.JSONB,
          defaultValue: {},
          // Additional cart data
          // Dữ liệu bổ sung của giỏ hàng
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  
      // Create CartItems table
      // Tạo bảng Chi tiết giỏ hàng
      await queryInterface.createTable('CartItems', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        cartId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Carts',
            key: 'id'
          },
          onDelete: 'CASCADE',
          // Reference to parent cart
          // Tham chiếu đến giỏ hàng chứa
        },
        productId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'id'
          },
          // Reference to product
          // Tham chiếu đến sản phẩm
        },
        quantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 1,
          // Product quantity in cart
          // Số lượng sản phẩm trong giỏ
        },
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false,
          // Price at time of adding to cart
          // Giá tại thời điểm thêm vào giỏ
        },
        specifications: {
          type: Sequelize.JSONB,
          defaultValue: {},
          // Product specifications (size, color, etc)
          // Thông số sản phẩm (kích thước, màu sắc, v.v.)
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('CartItems');
      await queryInterface.dropTable('Carts');
    }
  };