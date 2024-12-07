/**
 * Get specification templates by category
 * Lấy mẫu thông số theo danh mục
 */
exports.getTemplatesByCategory = async (req, res) => {
    try {
      const templates = await SpecificationTemplate.findAll({
        where: { categoryId: req.params.categoryId },
        order: [['displayOrder', 'ASC']]
      });
      res.json(templates);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Create specification template
   * Tạo mẫu thông số
   */
  exports.createTemplate = async (req, res) => {
    try {
      const {
        name,
        key,
        type,
        unit,
        options,
        required,
        categoryId,
        displayOrder,
        description,
        validation
      } = req.body;
  
      // Validate category exists
      // Kiểm tra danh mục tồn tại
      const category = await Category.findByPk(categoryId);
      if (!category) {
        return res.status(404).json({ 
          message: 'Category not found - Không tìm thấy danh mục' 
        });
      }
  
      const template = await SpecificationTemplate.create({
        name,
        key,
        type,
        unit,
        options: options ? JSON.parse(options) : [],
        required,
        categoryId,
        displayOrder,
        description,
        validation: validation ? JSON.parse(validation) : {}
      });
  
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Update specification template
   * Cập nhật mẫu thông số
   */
  exports.updateTemplate = async (req, res) => {
    try {
      const template = await SpecificationTemplate.findByPk(req.params.id);
      if (!template) {
        return res.status(404).json({ 
          message: 'Template not found - Không tìm thấy mẫu' 
        });
      }
  
      const {
        name,
        key,
        type,
        unit,
        options,
        required,
        displayOrder,
        description,
        validation
      } = req.body;
  
      await template.update({
        name: name || template.name,
        key: key || template.key,
        type: type || template.type,
        unit: unit || template.unit,
        options: options ? JSON.parse(options) : template.options,
        required: required !== undefined ? required : template.required,
        displayOrder: displayOrder || template.displayOrder,
        description: description || template.description,
        validation: validation ? JSON.parse(validation) : template.validation
      });
  
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Get product specifications
   * Lấy thông số sản phẩm
   */
  exports.getProductSpecifications = async (req, res) => {
    try {
      const specs = await ProductSpecification.findAll({
        where: { productId: req.params.productId },
        include: [{
          model: SpecificationTemplate,
          attributes: ['name', 'key', 'type', 'unit']
        }]
      });
      res.json(specs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Update product specifications
   * Cập nhật thông số sản phẩm
   */
  exports.updateProductSpecifications = async (req, res) => {
    try {
      const { specifications } = req.body; // Array of { templateId, value }
      const productId = req.params.productId;
  
      // Validate product exists
      // Kiểm tra sản phẩm tồn tại
      const product = await Product.findByPk(productId);
      if (!product) {
        return res.status(404).json({ 
          message: 'Product not found - Không tìm thấy sản phẩm' 
        });
      }
  
      // Start transaction
      // Bắt đầu giao dịch
      await sequelize.transaction(async (t) => {
        // Delete existing specifications
        // Xóa thông số hiện có
        await ProductSpecification.destroy({
          where: { productId },
          transaction: t
        });
  
        // Create new specifications
        // Tạo thông số mới
        if (specifications && specifications.length > 0) {
          await ProductSpecification.bulkCreate(
            specifications.map(spec => ({
              productId,
              specificationTemplateId: spec.templateId,
              value: spec.value
            })),
            { transaction: t }
          );
        }
      });
  
      // Fetch updated specifications
      // Lấy thông số đã cập nhật
      const updatedSpecs = await ProductSpecification.findAll({
        where: { productId },
        include: [{
          model: SpecificationTemplate,
          attributes: ['name', 'key', 'type', 'unit']
        }]
      });
  
      res.json(updatedSpecs);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Delete specification template
   * Xóa mẫu thông số
   */
  exports.deleteTemplate = async (req, res) => {
    try {
      const template = await SpecificationTemplate.findByPk(req.params.id);
      if (!template) {
        return res.status(404).json({ 
          message: 'Template not found - Không tìm thấy mẫu' 
        });
      }
  
      // Check if template is in use
      // Kiểm tra mẫu đang được sử dụng
      const specCount = await ProductSpecification.count({
        where: { specificationTemplateId: template.id }
      });
  
      if (specCount > 0) {
        return res.status(400).json({
          message: 'Template is in use by products - Mẫu đang được sử dụng bởi sản phẩm'
        });
      }
  
      await template.destroy();
      res.json({ 
        message: 'Template deleted successfully - Xóa mẫu thành công' 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  /**
   * Update template display order
   * Cập nhật thứ tự hiển thị mẫu
   */
  exports.updateDisplayOrder = async (req, res) => {
    try {
      const { displayOrder } = req.body;
      const template = await SpecificationTemplate.findByPk(req.params.id);
  
      if (!template) {
        return res.status(404).json({ 
          message: 'Template not found - Không tìm thấy mẫu' 
        });
      }
  
      await template.update({ displayOrder });
      res.json(template);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };