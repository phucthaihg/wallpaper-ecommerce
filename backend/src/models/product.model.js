const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Product Model - Mô hình Sản phẩm
 * Represents products in the e-commerce system
 * Đại diện cho các sản phẩm trong hệ thống thương mại điện tử
 */
const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    // Unique identifier for the product
    // Định danh duy nhất cho sản phẩm
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 100]
    },
    // Product name, 2-100 characters
    // Tên sản phẩm, 2-100 ký tự
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // URL-friendly version of name for SEO
    // Phiên bản thân thiện với URL của tên để SEO
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    // Detailed product description
    // Mô tả chi tiết về sản phẩm
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0
    },
    // Current selling price
    // Giá bán hiện tại
  },
  compareAtPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    validate: {
      min: 0
    },
    // Original price for showing discounts
    // Giá gốc để hiển thị giảm giá
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    // Stock Keeping Unit - unique product identifier
    // Mã quản lý hàng hóa - định danh sản phẩm
  },
  stockQuantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      min: 0
    },
    // Available quantity in stock
    // Số lượng có sẵn trong kho
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    },
    // Reference to product category
    // Tham chiếu đến danh mục sản phẩm
  },
  images: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    // Array of product image URLs
    // Mảng các URL hình ảnh sản phẩm
  },
  featuredImage: {
    type: DataTypes.STRING,
    allowNull: true,
    // Main product image URL
    // URL hình ảnh chính của sản phẩm
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    // Product status (active/inactive)
    // Trạng thái sản phẩm (hoạt động/không hoạt động)
  },
  tags: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: [],
    // Product tags for filtering and search
    // Thẻ sản phẩm để lọc và tìm kiếm
  },
  metadata: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // Additional metadata for SEO and display:
    // Metadata bổ sung cho SEO và hiển thị:
    // {
    //   metaTitle: string,        // SEO title / Tiêu đề SEO
    //   metaDescription: string,  // SEO description / Mô tả SEO
    //   keywords: string[],       // SEO keywords / Từ khóa SEO
    //   features: string[],       // Product features / Tính năng sản phẩm
    //   dimensions: {             // Product dimensions / Kích thước sản phẩm
    //     length: number,         // Chiều dài
    //     width: number,          // Chiều rộng
    //     height: number          // Chiều cao
    //   }
    // }
  },
  specifications: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // Product specifications based on category
    // Thông số kỹ thuật sản phẩm theo danh mục
  },
  brand: {
    type: DataTypes.STRING,
    allowNull: true,
    // Product brand name
    // Tên thương hiệu sản phẩm
  },
  warranty: {
    type: DataTypes.STRING,
    allowNull: true,
    // Warranty information
    // Thông tin bảo hành
  },
  weight: {
    type: DataTypes.FLOAT,
    allowNull: true,
    // Product weight in grams
    // Trọng lượng sản phẩm tính bằng gram
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Number of product views
    // Số lượt xem sản phẩm
  },
  avgRating: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
    validate: {
      min: 0,
      max: 5
    },
    // Average product rating
    // Đánh giá trung bình sản phẩm
  },
  reviewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Number of product reviews
    // Số lượng đánh giá sản phẩm
  }
}, {
  timestamps: true,  // Adds createdAt, updatedAt / Thêm createdAt, updatedAt
  paranoid: true,    // Soft delete / Xóa mềm
  hooks: {
    beforeValidate: (product) => {
      // Generate slug from name
      // Tạo slug từ tên
      if (product.name) {
        product.slug = product.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/[\s]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
    }
  }
});

// Instance Methods - Các phương thức của instance

/**
 * Calculate discount percentage
 * Tính phần trăm giảm giá
 */
Product.prototype.getDiscountPercentage = function () {
  if (!this.compareAtPrice || this.compareAtPrice <= this.price) {
    return 0;
  }
  return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
};

/**
 * Check if product is in stock
 * Kiểm tra sản phẩm còn hàng
 */
Product.prototype.isInStock = function () {
  return this.stockQuantity > 0;
};

/**
 * Increment view count
 * Tăng số lượt xem
 */
Product.prototype.incrementViewCount = async function () {
  this.viewCount += 1;
  await this.save();
};

/**
 * Update average rating
 * Cập nhật đánh giá trung bình
 */
Product.prototype.updateAverageRating = async function (newRating) {
  const newTotal = (this.avgRating * this.reviewCount) + newRating;
  this.reviewCount += 1;
  this.avgRating = newTotal / this.reviewCount;
  await this.save();
};

module.exports = Product;