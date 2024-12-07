const express = require('express');
const router = express.Router();
const specificationController = require('../controllers/specification.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

/**
 * Public routes
 * Route công khai
 */
router.get('/categories/:categoryId/specifications', 
  specificationController.getTemplatesByCategory
);

router.get('/products/:productId/specifications', 
  specificationController.getProductSpecifications
);

/**
 * Admin routes
 * Route dành cho admin
 */
router.use(authenticate, isAdmin);

router.post('/templates', specificationController.createTemplate);
router.put('/templates/:id', specificationController.updateTemplate);
router.delete('/templates/:id', specificationController.deleteTemplate);
router.put('/templates/:id/order', specificationController.updateDisplayOrder);

router.put('/products/:productId/specifications', 
  specificationController.updateProductSpecifications
);

module.exports = router;