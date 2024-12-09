const { Category, Product } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get all categories with hierarchy
 * Lấy tất cả danh mục theo cấu trúc phân cấp
 */
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: {
            model: Category,
            as: 'subcategories'
          }
        },
        {
          model: Category,
          as: 'parent'
        }
      ],
      where: {
        parentId: null // Get only root categories / Chỉ lấy danh mục gốc
      },
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
      ]
    });

    // Add product count to each category
    // Thêm số lượng sản phẩm cho mỗi danh mục
    for (let category of categories) {
      category.dataValues.productCount = await Product.count({
        where: { categoryId: category.id }
      });
    }

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get category by ID with all related data
 * Lấy danh mục theo ID kèm các dữ liệu liên quan
 */
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id, {
      include: [
        {
          model: Category,
          as: 'subcategories'
        },
        {
          model: Category,
          as: 'parent'
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found - Không tìm thấy danh mục' 
      });
    }

    // Add product count / Thêm số lượng sản phẩm
    category.dataValues.productCount = await Product.count({
      where: { categoryId: category.id }
    });

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get category by slug
 * Lấy danh mục theo slug
 */
exports.getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({
      where: { slug: req.params.slug },
      include: [
        {
          model: Category,
          as: 'subcategories'
        },
        {
          model: Category,
          as: 'parent'
        }
      ]
    });

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found - Không tìm thấy danh mục' 
      });
    }

    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Create new category
 * Tạo danh mục mới
 */
exports.createCategory = async (req, res) => {
  try {
    const { name, description, parentId, metadata } = req.body;

    // Handle image upload / Xử lý tải ảnh lên
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    // Validate parent category / Kiểm tra danh mục cha
    if (parentId) {
      const parentCategory = await Category.findByPk(parentId);
      if (!parentCategory) {
        return res.status(400).json({ 
          message: 'Parent category not found - Không tìm thấy danh mục cha' 
        });
      }
    }

    const category = await Category.create({
      name,
      description,
      parentId,
      image: imageUrl,
      metadata: metadata ? JSON.parse(metadata) : {},
    });

    res.status(201).json(category);
  } catch (error) {
    // Clean up uploaded file if error occurs
    // Xóa file đã tải lên nếu xảy ra lỗi
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update category
 * Cập nhật danh mục
 */
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, parentId, metadata, isActive } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found - Không tìm thấy danh mục' 
      });
    }

    // Handle image upload / Xử lý tải ảnh lên
    let imageUrl = category.image;
    if (req.file) {
      // Delete old image / Xóa ảnh cũ
      if (category.image) {
        const oldImagePath = path.join(__dirname, '../public', category.image);
        await fs.unlink(oldImagePath).catch(() => {});
      }
      imageUrl = `/uploads/categories/${req.file.filename}`;
    }

    // Prevent category from being its own parent
    // Ngăn danh mục trở thành cha của chính nó
    if (parentId && parentId === category.id) {
      return res.status(400).json({ 
        message: 'Category cannot be its own parent - Danh mục không thể là cha của chính nó' 
      });
    }

    await category.update({
      name: name || category.name,
      description: description || category.description,
      parentId: parentId || category.parentId,
      image: imageUrl,
      isActive: isActive !== undefined ? isActive : category.isActive,
      metadata: metadata ? JSON.parse(metadata) : category.metadata,
    });

    res.json(category);
  } catch (error) {
    if (req.file) {
      await fs.unlink(req.file.path).catch(() => {});
    }
    res.status(500).json({ message: error.message });
  }
};

/**
 * Delete category
 * Xóa danh mục
 */
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found - Không tìm thấy danh mục' 
      });
    }

    // Check if category has products
    // Kiểm tra danh mục có sản phẩm không
    const productCount = await Product.count({
      where: { categoryId: category.id }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete category with existing products - Không thể xóa danh mục đang có sản phẩm' 
      });
    }

    // Delete image if exists / Xóa ảnh nếu có
    if (category.image) {
      const imagePath = path.join(__dirname, '../public', category.image);
      await fs.unlink(imagePath).catch(() => {});
    }

    await category.destroy();
    res.json({ 
      message: 'Category deleted successfully - Xóa danh mục thành công' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Get products in category
 * Lấy sản phẩm trong danh mục
 */
exports.getCategoryProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const products = await Product.findAndCountAll({
      where: { categoryId: req.params.id },
      limit,
      offset,
      order: [['createdAt', 'DESC']]
    });

    res.json({
      products: products.rows,
      total: products.count,
      currentPage: page,
      totalPages: Math.ceil(products.count / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update category display order
 * Cập nhật thứ tự hiển thị của danh mục
 */
exports.updateDisplayOrder = async (req, res) => {
  try {
    const { displayOrder } = req.body;
    const category = await Category.findByPk(req.params.id);

    if (!category) {
      return res.status(404).json({ 
        message: 'Category not found - Không tìm thấy danh mục' 
      });
    }

    await category.update({ displayOrder });
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Bulk delete categories
 * Xóa nhiều danh mục cùng lúc
 */
exports.bulkDeleteCategories = async (req, res) => {
  try {
    const { ids } = req.body;

    // Check for products in categories
    // Kiểm tra sản phẩm trong các danh mục
    const productCount = await Product.count({
      where: { categoryId: { [Op.in]: ids } }
    });

    if (productCount > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete categories with existing products - Không thể xóa danh mục đang có sản phẩm' 
      });
    }

    // Get categories to delete images
    // Lấy danh mục để xóa ảnh
    const categories = await Category.findAll({
      where: { id: { [Op.in]: ids } }
    });

    // Delete images / Xóa ảnh
    for (const category of categories) {
      if (category.image) {
        const imagePath = path.join(__dirname, '../public', category.image);
        await fs.unlink(imagePath).catch(() => {});
      }
    }

    await Category.destroy({
      where: { id: { [Op.in]: ids } }
    });

    res.json({ 
      message: 'Categories deleted successfully - Xóa các danh mục thành công' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get category tree
exports.getCategoryTree = async (req, res) => {
  try {
    const categories = await Category.findAll({
      include: [
        {
          model: Category,
          as: 'subcategories',
          include: {
            model: Category,
            as: 'subcategories'
          }
        },
        {
          model: Category,
          as: 'parent'
        }
      ],
      order: [
        ['displayOrder', 'ASC'],
        ['name', 'ASC']
      ]
    });

    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};