import Board from '../models/Board';

class BoardController {
  async generalStore({ id, name }) {
    return (
      await Board.findOrCreate({
        where: {
          boardid: id,
        },
        defaults: {
          name,
        },
      })
    )[0];
  }
}

export default new BoardController();
