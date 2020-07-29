import Sequelize, { Model } from 'sequelize';

class Motor extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        boardid: Sequelize.INTEGER,
        pin: Sequelize.INTEGER,
        state: Sequelize.BOOLEAN,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Board, {
      foreignKey: 'boardid',
      as: 'board',
    });
  }
}

export default Motor;
