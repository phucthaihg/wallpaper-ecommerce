module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('ProductSpecifications', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        productId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Products',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        specificationTemplateId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'SpecificationTemplates',
            key: 'id'
          },
          onDelete: 'CASCADE'
        },
        value: {
          type: Sequelize.STRING,
          allowNull: false
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        }
      });
  
      // Create indexes
      await queryInterface.addIndex('ProductSpecifications', ['productId']);
      await queryInterface.addIndex('ProductSpecifications', ['specificationTemplateId']);
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('ProductSpecifications');
    }
  };