/**
 * Import database configuration
 * Import cấu hình database
 */
const sequelize = require('../config/database');

/**
 * Import models
 * Import các model
 */
const User = require('./user.model');
const Category = require('./category.model');
const Product = require('./product.model');
const SpecificationTemplate = require('./specification-template.model');
const ProductSpecification = require('./product-specification.model');

/**
 * Define relationships
 * Định nghĩa các mối quan hệ
 */

// Category relationships / Quan hệ của Category
Category.hasMany(Category, {
  as: 'subcategories',
  foreignKey: 'parentId'
});
Category.belongsTo(Category, {
  as: 'parent',
  foreignKey: 'parentId'
});

Category.hasMany(Product, {
  foreignKey: 'categoryId',
  as: 'products'
});
Category.hasMany(SpecificationTemplate, {
  foreignKey: 'categoryId',
  as: 'specificationTemplates'
});

// Product relationships / Quan hệ của Product
Product.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});
Product.hasMany(ProductSpecification, {
  foreignKey: 'productId',
  as: 'specifications'
});
Product.belongsTo(User, {
  foreignKey: 'createdBy',
  as: 'creator'
});
Product.belongsTo(User, {
  foreignKey: 'updatedBy',
  as: 'updater'
});

// SpecificationTemplate relationships / Quan hệ của SpecificationTemplate
SpecificationTemplate.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
});
SpecificationTemplate.hasMany(ProductSpecification, {
  foreignKey: 'specificationTemplateId',
  as: 'productSpecifications'
});

// ProductSpecification relationships / Quan hệ của ProductSpecification
ProductSpecification.belongsTo(Product, {
  foreignKey: 'productId',
  as: 'product'
});
ProductSpecification.belongsTo(SpecificationTemplate, {
  foreignKey: 'specificationTemplateId',
  as: 'template'
});

/**
 * Sync all models with database
 * Đồng bộ tất cả model với database
 */
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log('Database synced successfully - Đồng bộ database thành công');
  } catch (error) {
    console.error('Error syncing database - Lỗi đồng bộ database:', error);
    throw error;
  }
};

/**
 * Export models and database utilities
 * Export các model và tiện ích database
 */
module.exports = {
  sequelize,
  syncDatabase,
  User,
  Category,
  Product,
  SpecificationTemplate,
  ProductSpecification,
  models: {
    User,
    Category,
    Product,
    SpecificationTemplate,
    ProductSpecification
  }
};