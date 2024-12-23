module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('SpecificationTemplates', {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: Sequelize.INTEGER
        },
        name: {
          type: Sequelize.STRING,
          allowNull: false
        },
        key: {
          type: Sequelize.STRING,
          allowNull: false
        },
        type: {
          type: Sequelize.ENUM('text', 'number', 'select', 'textarea'),
          allowNull: false
        },
        unit: {
          type: Sequelize.STRING,
          allowNull: true
        },
        options: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: []
        },
        required: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        categoryId: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'Categories',
            key: 'id'
          }
        },
        displayOrder: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        validation: {
          type: Sequelize.JSONB,
          defaultValue: {}
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
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('SpecificationTemplates');
    }
  };