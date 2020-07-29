const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

import './database';
import cors from 'cors';
import bodyParser from 'body-parser';

import BoardController from './app/controller/BoardController';

import MotorController from './app/controller/MotorController';
import ScheduleController from './app/controller/ScheduleController';

const port = 80;
const manual = [];

function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis));
}

const loopEnableMotors = async () => {
  while (true) {
    const changeMotor = async (motor, state) => {
      const changedMotor = await MotorController.changeState(motor, state);
      if (changedMotor) {
        io.sockets.emit('pin', {
          id: changedMotor.id,
          pin: changedMotor.pin,
          state: changedMotor.state,
        });
      }
    };

    const motors = await ScheduleController.getMotorsToEnable();
    const motorsToDisable = (
      await MotorController.getAllEnabledMotorsGeneric()
    ).filter((motor) => !motors.find((sched) => sched.motor.id === motor.id));
    motors.forEach(async (sched) => {
      if (!sched.motor.state) changeMotor(sched.motor, true);
    });

    motorsToDisable.forEach((motor) => {
      if (motor.state && !manual.find((id) => id === motor.id))
        changeMotor(motor, false);
    });

    await sleep(15000);
  }
};

app.use(express.static(__dirname + '/node_modules'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

app.get('/schedule', ScheduleController.index);
app.post('/schedule', ScheduleController.store);
app.delete('/schedule/:id', ScheduleController.delete);

app.get('/motor', MotorController.index);

io.on('connection', async function (client) {
  (await MotorController.indexGeneric()).forEach((motor) =>
    io.sockets.emit('pin', { id: motor.id, pin: motor.pin, state: motor.state })
  );

  client.on('toggle', async function (payload) {
    const motor = await MotorController.changeState(payload);
    if (motor) {
      io.sockets.emit('pin', {
        id: motor.id,
        pin: motor.pin,
        state: motor.state,
      });
      const manualIndex = manual.findIndex((id) => id === motor.id);
      if (motor.state && manualIndex < 0) manual.push(motor.id);
      else if (manualIndex >= 0) manual.splice(manualIndex, 1);
    }
  });

  client.on('boardJoin', async function (payload) {
    const boardDetails = JSON.parse(String(payload).split("'").join('"'));
    const board = await BoardController.generalStore(boardDetails.board);
    if (board) {
      await Promise.all(
        boardDetails.motors.forEach(
          async (motor) =>
            await MotorController.generalStore({ boardid: board.id, ...motor })
        )
      );
    }
  });

  client.on('disconnect', function () {});
});

loopEnableMotors();

server.listen(port, () => {
  console.log(`Server is up and running on port ${port}`);
});
