import Sequelize, { Model } from 'sequelize';

class Schedule extends Model {
  static init(sequelize) {
    super.init(
      {
        motorid: Sequelize.INTEGER,
        start: Sequelize.TIME,
        end: Sequelize.TIME,
      },
      { sequelize }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.Motor, {
      foreignKey: 'motorid',
      as: 'motor',
    });
  }
}

export default Schedule;
