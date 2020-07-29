import Sequelize from 'sequelize';

import databaseConfig from '../config/database';
import Board from '../app/models/Board';
import Motor from '../app/models/Motor';
import Schedule from '../app/models/Schedule';

const models = [Board, Motor, Schedule];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map(
        (model) => model.associate && model.associate(this.connection.models)
      );
  }
}

export default new Database();
