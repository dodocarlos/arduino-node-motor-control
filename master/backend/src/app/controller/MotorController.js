import Motor from '../models/Motor';

class MotorController {
  async indexGeneric() {
    return await Motor.findAll();
  }

  async index(req, res) {
    const { boardid } = req.query;
    if (boardid) {
      return res.json(
        await Motor.findAll({
          where: {
            boardid,
          },
          order: ['id'],
        })
      );
    } else
      return res
        .status(400)
        .json({ error: 'o id de placa informado é inválido' });
  }

  async generalStore({ boardid, name, pin }) {
    return (
      await Motor.findOrCreate({
        where: {
          boardid,
          pin,
        },
        defaults: {
          name,
        },
      })
    )[0];
  }

  async changeState({ id }, state) {
    const motor = await Motor.findByPk(id);
    if (motor)
      return await motor.update(
        { state: state ?? !motor.state },
        {
          where: id,
        }
      );
  }

  async getAllEnabledMotorsGeneric() {
    return await Motor.findAll({
      where: {
        state: true,
      },
    });
  }
}

export default new MotorController();
