module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Units', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('uuid_generate_v4()'),
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      floor: {
        type: Sequelize.STRING,
      },
      type: {
        type: Sequelize.STRING,
      },
      area: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
      },
      spaceId: {
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('Units');
  },
};
