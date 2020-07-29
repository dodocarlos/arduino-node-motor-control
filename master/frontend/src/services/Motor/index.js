import api from '../api';

const MOTOR_BASE_URL = '/motor';

export const getAllMotors = async (boardid) => {
  return (
    await api.get(MOTOR_BASE_URL, {
      params: {
        boardid,
      },
    })
  ).data;
};
