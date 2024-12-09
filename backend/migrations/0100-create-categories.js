module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Categories', {
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
        slug: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true
        },
        image: {
          type: Sequelize.STRING,
          allowNull: true
        },
        parentId: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'Categories',
            key: 'id'
          }
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        displayOrder: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        metadata: {
          type: Sequelize.JSONB,
          defaultValue: {}
        },
        level: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        path: {
          type: Sequelize.STRING,
          allowNull: true
        },
        createdAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        updatedAt: {
          type: Sequelize.DATE,
          allowNull: false
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Categories');
    }
  };