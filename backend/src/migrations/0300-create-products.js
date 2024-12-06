module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Products', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
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
        price: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: false
        },
        compareAtPrice: {
          type: Sequelize.DECIMAL(10, 2),
          allowNull: true
        },
        sku: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        stockQuantity: {
          type: Sequelize.INTEGER,
          allowNull: false,
          defaultValue: 0
        },
        categoryId: {
          type: Sequelize.UUID,
          allowNull: false,
          references: {
            model: 'Categories',
            key: 'id'
          }
        },
        images: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: []
        },
        featuredImage: {
          type: Sequelize.STRING,
          allowNull: true
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        tags: {
          type: Sequelize.ARRAY(Sequelize.STRING),
          defaultValue: []
        },
        metadata: {
          type: Sequelize.JSONB,
          defaultValue: {}
        },
        brand: {
          type: Sequelize.STRING,
          allowNull: true
        },
        warranty: {
          type: Sequelize.STRING,
          allowNull: true
        },
        weight: {
          type: Sequelize.FLOAT,
          allowNull: true
        },
        viewCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        avgRating: {
          type: Sequelize.FLOAT,
          defaultValue: 0
        },
        reviewCount: {
          type: Sequelize.INTEGER,
          defaultValue: 0
        },
        createdBy: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          }
        },
        updatedBy: {
          type: Sequelize.UUID,
          allowNull: true,
          references: {
            model: 'Users',
            key: 'id'
          }
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
      await queryInterface.dropTable('Products');
    }
  };