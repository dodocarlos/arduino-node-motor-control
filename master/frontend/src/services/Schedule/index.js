import api from '../api';

const SCHEDULE_BASE_URL = '/schedule';

export const getAllSchedules = async (motorid) => {
  return (
    await api.get(SCHEDULE_BASE_URL, {
      params: {
        motorid,
      },
    })
  ).data;
};

export const deleteSchedules = async (scheduleId) => {
  return (await api.delete(`${SCHEDULE_BASE_URL}/${scheduleId}`)).data;
};

export const addSchedule = async (motorid, start, end) => {
  return (
    await api.post(SCHEDULE_BASE_URL, {
      motorid,
      start,
      end,
    })
  ).data;
};
