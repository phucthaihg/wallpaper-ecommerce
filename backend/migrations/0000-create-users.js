module.exports = {
    up: async (queryInterface, Sequelize) => {
      await queryInterface.createTable('Users', {
        id: {
          type: Sequelize.UUID,
          defaultValue: Sequelize.UUIDV4,
          primaryKey: true
        },
        email: {
          type: Sequelize.STRING,
          allowNull: false,
          unique: true
        },
        password: {
          type: Sequelize.STRING,
          allowNull: false
        },
        firstName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        lastName: {
          type: Sequelize.STRING,
          allowNull: false
        },
        phone: {
          type: Sequelize.STRING,
          allowNull: true
        },
        role: {
          type: Sequelize.ENUM('customer', 'admin', 'staff'),
          defaultValue: 'customer'
        },
        isActive: {
          type: Sequelize.BOOLEAN,
          defaultValue: true
        },
        lastLogin: {
          type: Sequelize.DATE,
          allowNull: true
        },
        addresses: {
          type: Sequelize.JSONB,
          defaultValue: []
        },
        resetPasswordToken: {
          type: Sequelize.STRING,
          allowNull: true
        },
        resetPasswordExpires: {
          type: Sequelize.DATE,
          allowNull: true
        },
        emailVerified: {
          type: Sequelize.BOOLEAN,
          defaultValue: false
        },
        emailVerificationToken: {
          type: Sequelize.STRING,
          allowNull: true
        },
        avatar: {
          type: Sequelize.STRING,
          allowNull: true
        },
        preferences: {
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
        },
        deletedAt: {
          type: Sequelize.DATE,
          allowNull: true
        }
      });
    },
  
    down: async (queryInterface, Sequelize) => {
      await queryInterface.dropTable('Users');
    }
  };