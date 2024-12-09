'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductSpecifications', [
      // Product 1 - BELLEWOOD
      {
        productId: 1,
        specificationTemplateId: 1,
        value: 'Non-woven',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 1,
        specificationTemplateId: 2,
        value: '0.53m x 10.05m',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 1,
        specificationTemplateId: 3,
        value: '64cm repeat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 1,
        specificationTemplateId: 4,
        value: 'Spongeable',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 2 - PETALS, SAND
      {
        productId: 2,
        specificationTemplateId: 1,
        value: 'Non-woven',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        specificationTemplateId: 2,
        value: '0.53m x 10.05m',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        specificationTemplateId: 3,
        value: '64cm repeat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 2,
        specificationTemplateId: 4,
        value: 'Spongeable',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 3 - MISCHIEVOUS MONKEYS, LUSH
      {
        productId: 3,
        specificationTemplateId: 1,
        value: 'Non-woven',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 3,
        specificationTemplateId: 2,
        value: '0.53m x 10.05m',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 3,
        specificationTemplateId: 3,
        value: '64cm repeat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 3,
        specificationTemplateId: 4,
        value: 'Spongeable',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 4 - CUDDLE CLOUDS
      {
        productId: 4,
        specificationTemplateId: 1,
        value: 'Non-woven',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 4,
        specificationTemplateId: 2,
        value: '0.53m x 10.05m',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 4,
        specificationTemplateId: 3,
        value: '64cm repeat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 4,
        specificationTemplateId: 4,
        value: 'Spongeable',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 5 - CHINOISERIE CHIC
      {
        productId: 5,
        specificationTemplateId: 1,
        value: 'Non-woven',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 5,
        specificationTemplateId: 2,
        value: '0.53m x 10.05m',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 5,
        specificationTemplateId: 3,
        value: '64cm repeat',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 5,
        specificationTemplateId: 4,
        value: 'Spongeable',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 6 - Sabrina (Curtain)
      {
        productId: 6,
        specificationTemplateId: 5,
        value: '100% Polyester',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 6,
        specificationTemplateId: 6,
        value: '54" x 84"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 6,
        specificationTemplateId: 7,
        value: 'Machine washable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 6,
        specificationTemplateId: 8,
        value: '2 panels',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 7 - Oakley (Curtain)
      {
        productId: 7,
        specificationTemplateId: 5,
        value: '100% Polyester',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 7,
        specificationTemplateId: 6,
        value: '54" x 84"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 7,
        specificationTemplateId: 7,
        value: 'Machine washable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 7,
        specificationTemplateId: 8,
        value: '2 panels',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 8 - Lesley (Curtain)
      {
        productId: 8,
        specificationTemplateId: 5,
        value: '100% Polyester',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 8,
        specificationTemplateId: 6,
        value: '54" x 84"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 8,
        specificationTemplateId: 7,
        value: 'Machine washable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 8,
        specificationTemplateId: 8,
        value: '2 panels',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 9 - Margaret (Curtain)
      {
        productId: 9,
        specificationTemplateId: 5,
        value: '100% Polyester',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 9,
        specificationTemplateId: 6,
        value: '54" x 84"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 9,
        specificationTemplateId: 7,
        value: 'Machine washable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 9,
        specificationTemplateId: 8,
        value: '2 panels',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 10 - Amber (Curtain)
      {
        productId: 10,
        specificationTemplateId: 5,
        value: '100% Polyester',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 10,
        specificationTemplateId: 6,
        value: '54" x 84"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 10,
        specificationTemplateId: 7,
        value: 'Machine washable',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 10,
        specificationTemplateId: 8,
        value: '2 panels',
        createdAt: new Date(),
        updatedAt: new Date()
      },

      // Product 11 - Decorative Curtain Rod
      {
        productId: 11,
        specificationTemplateId: 9,
        value: 'Metal',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 11,
        specificationTemplateId: 10,
        value: 'Brushed Nickel',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 11,
        specificationTemplateId: 11,
        value: 'Adjustable 28"-48"',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        productId: 11,
        specificationTemplateId: 12,
        value: '1 inch',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductSpecifications', null, {});
  }
};