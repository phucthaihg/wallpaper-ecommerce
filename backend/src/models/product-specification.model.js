const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSpecification = sequelize.define('ProductSpecification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
    // Unique identifier
    // Định danh duy nhất
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    },
    // Associated product ID
    // ID sản phẩm liên quan
  },
  specificationTemplateId: {
    type: DataTypes.UUID,
    allowNull: false,
    references: {
      model: 'SpecificationTemplates',
      key: 'id'
    },
    // Associated template ID
    // ID mẫu thông số liên quan
  },
  value: {
    type: DataTypes.STRING,
    allowNull: false,
    // Specification value
    // Giá trị thông số
  }
});

module.exports = ProductSpecification;