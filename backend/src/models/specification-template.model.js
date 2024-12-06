const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

/**
 * Specification Template Model
 * Mô hình Mẫu Thông số kỹ thuật
 */
const SpecificationTemplate = sequelize.define('SpecificationTemplate', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    // Unique identifier for template
    // Định danh duy nhất cho mẫu
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    // Display name of specification
    // Tên hiển thị của thông số
  },
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true
    },
    // Unique key for specification
    // Khóa duy nhất cho thông số
  },
  type: {
    type: DataTypes.ENUM('text', 'number', 'select', 'textarea'),
    allowNull: false,
    // Data type of specification
    // Kiểu dữ liệu của thông số
  },
  unit: {
    type: DataTypes.STRING,
    allowNull: true,
    // Measurement unit (cm, m, kg, etc)
    // Đơn vị đo lường (cm, m, kg, v.v.)
  },
  options: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    allowNull: true,
    defaultValue: [],
    // Available options for select type
    // Các tùy chọn cho kiểu select
  },
  required: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    // Whether specification is required
    // Thông số có bắt buộc hay không
  },
  categoryId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Categories',
      key: 'id'
    },
    // Associated category ID
    // ID của danh mục liên quan
  },
  displayOrder: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    // Display order in form
    // Thứ tự hiển thị trong biểu mẫu
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    // Help text for specification
    // Văn bản trợ giúp cho thông số
  },
  validation: {
    type: DataTypes.JSONB,
    defaultValue: {},
    // Validation rules
    // Quy tắc xác thực
    // {
    //   min: number,        // Minimum value / Giá trị tối thiểu
    //   max: number,        // Maximum value / Giá trị tối đa
    //   pattern: string,    // Regex pattern / Mẫu regex
    //   message: string     // Error message / Thông báo lỗi
    // }
  }
});

module.exports = SpecificationTemplate;