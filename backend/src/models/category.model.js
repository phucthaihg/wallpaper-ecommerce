// models/category.model.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Category Model - Mô hình Danh mục
 * Represents product categories in the e-commerce system
 * Đại diện cho các danh mục sản phẩm trong hệ thống thương mại điện tử
 */
const Category = sequelize.define('Category', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    // Unique identifier for the category
    // Định danh duy nhất cho danh mục
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [2, 50]
    },
    // Category name, 2-50 characters
    // Tên danh mục, 2-50 ký tự
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
    // Detailed category description
    // Mô tả chi tiết về danh mục
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    validate: {
      isUrl: true
    },
    // Category image URL
    // URL hình ảnh danh mục
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    references: {
      model: 'Categories',
      key: 'id'
    },
    // Reference to parent category for hierarchical structure
    // Tham chiếu đến danh mục cha cho cấu trúc phân cấp
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    // Category status (active/inactive)
    // Trạng thái danh mục (hoạt động/không hoạt động)
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Display order for sorting
    // Thứ tự hiển thị để sắp xếp
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
    //   iconClass: string,        // Icon class for display / Class icon để hiển thị
    //   featuredOrder: number     // Order in featured list / Thứ tự trong danh sách nổi bật
    // }
  },
  level: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Category level in hierarchy (0 for root)
    // Cấp độ danh mục trong phân cấp (0 cho danh mục gốc)
  },
  path: {
    type: DataTypes.STRING,
    allowNull: true,
    // Full path of category IDs (e.g., "root/parent/child")
    // Đường dẫn đầy đủ của ID danh mục (ví dụ: "root/parent/child")
  }
}, {
  timestamps: true,  // Adds createdAt, updatedAt / Thêm createdAt, updatedAt
  paranoid: true,    // Soft delete / Xóa mềm
  hooks: {
    beforeValidate: async (category) => {
      // Generate slug from name
      // Tạo slug từ tên
      if (category.name) {
        category.slug = category.name
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[đĐ]/g, 'd')
          .replace(/[^a-zA-Z0-9\s]/g, '')
          .replace(/[\s]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }

      // Update level and path if parent changes
      // Cập nhật level và path nếu parentId thay đổi
      if (category.changed('parentId')) {
        if (!category.parentId) {
          category.level = 0;
          category.path = category.id;
        } else {
          const parent = await Category.findByPk(category.parentId);
          if (parent) {
            category.level = parent.level + 1;
            category.path = `${parent.path}/${category.id}`;
          }
        }
      }
    }
  }
});

// Instance Methods - Các phương thức của instance
/**
 * Get full category path names
 * Lấy đường dẫn đầy đủ tên danh mục
 */
Category.prototype.getFullPath = async function () {
  const path = [];
  let current = this;

  while (current) {
    path.unshift(current.name);
    if (current.parentId) {
      current = await Category.findByPk(current.parentId);
    } else {
      break;
    }
  }

  return path.join(' > ');
};

/**
 * Get all subcategories (recursive)
 * Lấy tất cả danh mục con (đệ quy)
 */
Category.prototype.getAllSubcategories = async function () {
  const subcategories = await Category.findAll({
    where: { path: { [Op.like]: `${this.path}/%` } }
  });
  return subcategories;
};

/**
 * Check if category can be deleted
 * Kiểm tra xem danh mục có thể xóa không
 */
Category.prototype.canDelete = async function () {
  // Check for products in this category
  // Kiểm tra sản phẩm trong danh mục này
  const productCount = await Product.count({
    where: { categoryId: this.id }
  });

  // Check for subcategories
  // Kiểm tra danh mục con
  const subcategoryCount = await Category.count({
    where: { parentId: this.id }
  });

  return productCount === 0 && subcategoryCount === 0;
};

module.exports = Category;