import Schedule from '../models/Schedule';
import { Op } from 'sequelize';
import Motor from '../models/Motor';
import moment from 'moment';

class ScheduleController {
  async index(req, res) {
    const { motorid } = req.query;
    if (motorid)
      return res.json(
        await Schedule.findAll({
          attributes: ['id', 'start', 'end'],
          where: {
            motorid,
          },
          order: ['start'],
        })
      );
    else
      return res
        .status(400)
        .json({ error: 'O id de motor informado é inválido' });
  }

  async store(req, res) {
    const { motorid, start, end } = req.body;

    if (motorid) {
      return res.json(await Schedule.create({ motorid, start, end }));
    } else
      return res
        .status(400)
        .json({ error: 'O id de motor informado é inválido' });
  }

  async delete(req, res) {
    const { id } = req.params;
    if (id) {
      const schedule = await Schedule.findByPk(id);
      if (schedule) await schedule.destroy();
      return res.json(schedule);
    } else
      return res
        .status(400)
        .json({ error: 'O id de motor informado é inválido' });
  }

  async getMotorsToEnable() {
    const date = moment().format('HH:mm');
    return await Schedule.findAll({
      where: {
        [Op.and]: {
          start: {
            [Op.lte]: date,
          },
          end: {
            [Op.gte]: date,
          },
        },
      },
      include: [
        {
          model: Motor,
          as: 'motor',
          required: true,
          // where: {
          //   state: false,
          // },
        },
      ],
    });
  }
}

export default new ScheduleController();
