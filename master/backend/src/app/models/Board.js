import Sequelize, { Model } from 'sequelize';

class Board extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        boardid: Sequelize.INTEGER,
      },
      { sequelize }
    );

    return this;
  }
}

export default Board;
