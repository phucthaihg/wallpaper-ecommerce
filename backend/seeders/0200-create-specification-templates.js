'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('SpecificationTemplates', [
      // Specification Templates for "Giấy Dán Tường"
      {
        id: 1,
        name: 'Material',
        key: 'material',
        type: 'select',
        unit: null,
        options: ['Non-woven', '100% Polyester', 'Metal'],
        required: true,
        categoryId: 1,
        displayOrder: 1,
        description: 'The material used for the wallpaper',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 2,
        name: 'Roll Dimensions',
        key: 'rollDimensions',
        type: 'text',
        unit: null,
        options: ["0.53m x 10.05m", "54\" x 84\"", "60\" x 120\""],
        required: true,
        categoryId: 1,
        displayOrder: 2,
        description: 'The dimensions of the wallpaper roll',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 3,
        name: 'Pattern',
        key: 'pattern',
        type: 'select',
        unit: null,
        options: ['64cm repeat', 'Floral', 'Striped'],
        required: true,
        categoryId: 1,
        displayOrder: 3,
        description: 'The pattern of the wallpaper',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 4,
        name: 'Washability',
        key: 'washability',
        type: 'select',
        unit: null,
        options: ['Spongeable', 'Machine washable', 'Dry clean only'],
        required: true,
        categoryId: 1,
        displayOrder: 4,
        description: 'The washability of the wallpaper',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Specification Templates for "Rèm Cửa"
      {
        id: 5,
        name: 'Material',
        key: 'material',
        type: 'select',
        unit: null,
        options: ['Cotton', 'Polyester', 'Linen'],
        required: true,
        categoryId: 2,
        displayOrder: 1,
        description: 'The material used for the curtain',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 6,
        name: 'Dimensions',
        key: 'dimensions',
        type: 'text',
        unit: null,
        options: ["52\" x 84\"", "54\" x 96\"", "60\" x 120\""],
        required: true,
        categoryId: 2,
        displayOrder: 2,
        description: 'The dimensions of the curtain',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 7,
        name: 'Care Instructions',
        key: 'careInstructions',
        type: 'textarea',
        unit: null,
        options: ["Machine wash cold", "Tumble dry low", "Warm iron"],
        required: true,
        categoryId: 2,
        displayOrder: 3,
        description: 'The care instructions for the curtain',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 8,
        name: 'Includes',
        key: 'includes',
        type: 'text',
        unit: null,
        options: ["Two panels", "Two tiebacks", "Two curtain rods"],
        required: false,
        categoryId: 2,
        displayOrder: 4,
        description: 'What is included with the curtain',
        validation: JSON.stringify({}),
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Specification Templates for "Phụ Kiện"
      {
        id: 9,
        name: 'Material',
        key: 'material',
        type: 'select',
        unit: null,
        options: ['Metal', 'Plastic', 'Wood'],
        required: true,
        categoryId: 3,
        displayOrder: 1,
        description: 'The material used for the accessory',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 10,
        name: 'Finish',
        key: 'finish',
        type: 'select',
        unit: null,
        options: ['Brushed Nickel', 'Chrome', 'Matte Black'],
        required: true,
        categoryId: 3,
        displayOrder: 2,
        description: 'The finish of the accessory',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 11,
        name: 'Length',
        key: 'length',
        type: 'select',
        unit: 'inches',
        options: ['28"-48"', '48"-84"', '84"-120"'],
        required: true,
        categoryId: 3,
        displayOrder: 3,
        description: 'The length of the accessory',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 12,
        name: 'Diameter',
        key: 'diameter',
        type: 'select',
        unit: 'inches',
        options: ['1 inch', '1.25 inches', '1.5 inches'],
        required: true,
        categoryId: 3,
        displayOrder: 4,
        description: 'The diameter of the accessory',
        validation: JSON.stringify({
          required: true
        }),
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpecificationTemplates', null, {});
  }
};