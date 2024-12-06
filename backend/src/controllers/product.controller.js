const { Product, Category } = require('../models');
const { Op } = require('sequelize');
const fs = require('fs').promises;
const path = require('path');

/**
 * Get all products with filtering, sorting, and pagination
 * Lấy tất cả sản phẩm với bộ lọc, sắp xếp và phân trang
 */
exports.getAllProducts = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            sort = 'createdAt',
            order = 'DESC',
            category,
            minPrice,
            maxPrice,
            search,
            inStock
        } = req.query;

        const where = { isActive: true };

        // Apply filters / Áp dụng bộ lọc
        if (search) {
            where[Op.or] = [
                { name: { [Op.iLike]: `%${search}%` } },
                { description: { [Op.iLike]: `%${search}%` } },
                { tags: { [Op.contains]: [search] } }
            ];
        }

        if (category) {
            where.categoryId = category;
        }

        if (minPrice || maxPrice) {
            where.price = {};
            if (minPrice) where.price[Op.gte] = minPrice;
            if (maxPrice) where.price[Op.lte] = maxPrice;
        }

        if (inStock === 'true') {
            where.stockQuantity = { [Op.gt]: 0 };
        }

        const products = await Product.findAndCountAll({
            where,
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [[sort, order]],
            distinct: true
        });

        res.json({
            products: products.rows,
            total: products.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(products.count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Create new product
 * Tạo sản phẩm mới
 */
exports.createProduct = async (req, res) => {
    try {
        const {
            name,
            description,
            price,
            compareAtPrice,
            sku,
            stockQuantity,
            categoryId,
            specifications,
            tags,
            metadata,
            brand,
            warranty,
            weight
        } = req.body;

        // Handle image uploads / Xử lý tải ảnh lên
        const images = req.files ? req.files.map(file => `/uploads/products/${file.filename}`) : [];
        const featuredImage = images.length > 0 ? images[0] : null;

        const product = await Product.create({
            name,
            description,
            price,
            compareAtPrice,
            sku,
            stockQuantity,
            categoryId,
            specifications: specifications ? JSON.parse(specifications) : {},
            tags: tags ? JSON.parse(tags) : [],
            metadata: metadata ? JSON.parse(metadata) : {},
            images,
            featuredImage,
            brand,
            warranty,
            weight: weight ? parseFloat(weight) : null
        });

        // Fetch complete product with category
        // Lấy sản phẩm đầy đủ với danh mục
        const completeProduct = await Product.findByPk(product.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        res.status(201).json(completeProduct);
    } catch (error) {
        // Clean up uploaded files if error occurs
        // Xóa các file đã tải lên nếu xảy ra lỗi
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => { });
            }
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get featured products
 * Lấy sản phẩm nổi bật
 */
exports.getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product.findAll({
            where: {
                isActive: true,
                stockQuantity: { [Op.gt]: 0 }
            },
            order: [
                ['viewCount', 'DESC'],
                ['avgRating', 'DESC']
            ],
            limit: 8,
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update product
 * Cập nhật sản phẩm
 */
exports.updateProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found - Không tìm thấy sản phẩm' });
        }

        // Handle image uploads / Xử lý tải ảnh lên
        let images = product.images;
        if (req.files && req.files.length > 0) {
            // Delete old images / Xóa ảnh cũ
            for (const oldImage of product.images) {
                const imagePath = path.join(__dirname, '../public', oldImage);
                await fs.unlink(imagePath).catch(() => { });
            }
            images = req.files.map(file => `/uploads/products/${file.filename}`);
        }

        await product.update({
            ...req.body,
            images,
            featuredImage: images.length > 0 ? images[0] : product.featuredImage,
            specifications: req.body.specifications ? JSON.parse(req.body.specifications) : product.specifications,
            tags: req.body.tags ? JSON.parse(req.body.tags) : product.tags,
            metadata: req.body.metadata ? JSON.parse(req.body.metadata) : product.metadata
        });

        const updatedProduct = await Product.findByPk(product.id, {
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        res.json(updatedProduct);
    } catch (error) {
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => { });
            }
        }
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update product stock
 * Cập nhật tồn kho sản phẩm
 */
exports.updateStock = async (req, res) => {
    try {
        const { stockQuantity } = req.body;
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Product not found - Không tìm thấy sản phẩm' });
        }

        if (stockQuantity < 0) {
            return res.status(400).json({ message: 'Stock quantity cannot be negative - Số lượng tồn kho không thể âm' });
        }

        await product.update({ stockQuantity });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Search products
 * Tìm kiếm sản phẩm
 */
exports.searchProducts = async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;

        const products = await Product.findAll({
            where: {
                [Op.or]: [
                    { name: { [Op.iLike]: `%${q}%` } },
                    { description: { [Op.iLike]: `%${q}%` } },
                    { tags: { [Op.contains]: [q] } }
                ],
                isActive: true
            },
            limit: parseInt(limit),
            include: [{
                model: Category,
                as: 'category'
            }]
        });

        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get product by ID
 * Lấy sản phẩm theo ID
 */
exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id, {
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }]
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found - Không tìm thấy sản phẩm'
            });
        }

        // Increment view count
        // Tăng số lượt xem
        await product.incrementViewCount();

        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get product by slug
 * Lấy sản phẩm theo slug
 */
exports.getProductBySlug = async (req, res) => {
    try {
        const product = await Product.findOne({
            where: { slug: req.params.slug },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }]
        });

        if (!product) {
            return res.status(404).json({
                message: 'Product not found - Không tìm thấy sản phẩm'
            });
        }

        await product.incrementViewCount();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get products by category
 * Lấy sản phẩm theo danh mục
 */
exports.getProductsByCategory = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            sort = 'createdAt',
            order = 'DESC'
        } = req.query;

        // Find category and its subcategories
        // Tìm danh mục và các danh mục con
        const category = await Category.findByPk(req.params.categoryId);
        if (!category) {
            return res.status(404).json({
                message: 'Category not found - Không tìm thấy danh mục'
            });
        }

        const subcategories = await category.getAllSubcategories();
        const categoryIds = [category.id, ...subcategories.map(sub => sub.id)];

        const products = await Product.findAndCountAll({
            where: {
                categoryId: { [Op.in]: categoryIds },
                isActive: true
            },
            include: [{
                model: Category,
                as: 'category',
                attributes: ['id', 'name', 'slug']
            }],
            limit: parseInt(limit),
            offset: (page - 1) * limit,
            order: [[sort, order]]
        });

        res.json({
            products: products.rows,
            total: products.count,
            currentPage: parseInt(page),
            totalPages: Math.ceil(products.count / limit)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Delete product
 * Xóa sản phẩm
 */
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({
                message: 'Product not found - Không tìm thấy sản phẩm'
            });
        }

        // Delete product images
        // Xóa hình ảnh sản phẩm
        for (const image of product.images) {
            const imagePath = path.join(__dirname, '../public', image);
            await fs.unlink(imagePath).catch(() => { });
        }

        await product.destroy(); // Soft delete / Xóa mềm
        res.json({ message: 'Product deleted successfully - Xóa sản phẩm thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Bulk delete products
 * Xóa nhiều sản phẩm
 */
exports.bulkDeleteProducts = async (req, res) => {
    try {
        const { ids } = req.body;

        // Get products to delete their images
        // Lấy sản phẩm để xóa hình ảnh
        const products = await Product.findAll({
            where: { id: { [Op.in]: ids } }
        });

        // Delete images / Xóa hình ảnh
        for (const product of products) {
            for (const image of product.images) {
                const imagePath = path.join(__dirname, '../public', image);
                await fs.unlink(imagePath).catch(() => { });
            }
        }

        await Product.destroy({
            where: { id: { [Op.in]: ids } }
        });

        res.json({
            message: 'Products deleted successfully - Xóa các sản phẩm thành công'
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Get related products
 * Lấy sản phẩm liên quan
 */
exports.getRelatedProducts = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found - Không tìm thấy sản phẩm'
            });
        }

        const relatedProducts = await Product.findAll({
            where: {
                categoryId: product.categoryId,
                id: { [Op.ne]: product.id },
                isActive: true
            },
            include: [{
                model: Category,
                as: 'category'
            }],
            limit: 8,
            order: sequelize.random()
        });

        res.json(relatedProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

/**
 * Update product images
 * Cập nhật hình ảnh sản phẩm
 */
exports.updateProductImages = async (req, res) => {
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({
                message: 'Product not found - Không tìm thấy sản phẩm'
            });
        }

        // Handle image uploads
        // Xử lý tải ảnh lên
        const newImages = req.files.map(file => `/uploads/products/${file.filename}`);
        const imagesToKeep = req.body.keepImages ? JSON.parse(req.body.keepImages) : [];

        // Delete removed images
        // Xóa hình ảnh đã bỏ
        for (const oldImage of product.images) {
            if (!imagesToKeep.includes(oldImage)) {
                const imagePath = path.join(__dirname, '../public', oldImage);
                await fs.unlink(imagePath).catch(() => { });
            }
        }

        // Update product images
        // Cập nhật hình ảnh sản phẩm
        const updatedImages = [...imagesToKeep, ...newImages];
        await product.update({
            images: updatedImages,
            featuredImage: updatedImages[0] || null
        });

        res.json(product);
    } catch (error) {
        // Clean up uploaded files if error occurs
        // Xóa các file đã tải lên nếu xảy ra lỗi
        if (req.files) {
            for (const file of req.files) {
                await fs.unlink(file.path).catch(() => { });
            }
        }
        res.status(500).json({ message: error.message });
    }
};

module.exports = exports;