const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductSpecification = sequelize.define('ProductSpecification', {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    },
    // Associated product ID
    // ID sản phẩm liên quan
  },
  specificationTemplateId: {
    type: DataTypes.INTEGER,
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