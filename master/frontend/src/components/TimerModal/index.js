import React, { useState, useEffect } from 'react';
import Modal from 'antd/lib/modal/Modal';
import { Row, Col, TimePicker, Table } from 'antd';
import { PlusCircleOutlined, MinusCircleOutlined } from '@ant-design/icons';
import {
  getAllSchedules,
  deleteSchedules,
  addSchedule,
} from '../../services/Schedule';

const timeFormat = 'HH:mm';

function TimerModal({ motorid, motorName, visible, onClickCancel, onClickOk }) {
  const columns = [
    {
      title: 'Início',
      dataIndex: 'start',
    },
    {
      title: 'Fim',
      dataIndex: 'end',
    },
    {
      title: 'Remover',
      dataIndex: 'id',
      render: (scheduleId) => (
        <MinusCircleOutlined
          style={{ fontSize: '18px' }}
          onClick={() => handleDeleteSchedule(scheduleId)}
        />
      ),
    },
  ];

  const [confirmLoading, setConfirmLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [start, setStart] = useState(0);
  const [end, setEnd] = useState(0);

  useEffect(() => {
    const getMotorSchedule = async () => {
      const schedules = await getAllSchedules(motorid);
      setDataSource(
        schedules.map((sched) => ({
          key: sched.id,
          ...sched,
        }))
      );
    };

    getMotorSchedule();
  }, [motorid]);

  const handleClickOk = () => {
    if (onClickOk) onClickOk();
  };

  const handleAddSchedule = async () => {
    const schedule = await addSchedule(motorid, start, end);
    if (schedule) {
      const data = [...dataSource];
      data.push({
        key: schedule.id,
        id: schedule.id,
        start: schedule.start,
        end: schedule.end,
      });
      setDataSource(data);
    }
  };

  const handleDeleteSchedule = async (scheduleId) => {
    await deleteSchedules(scheduleId);
    setDataSource(dataSource.filter((sched) => sched.key !== scheduleId));
  };

  return (
    <Modal
      title={motorName}
      visible={visible}
      onOk={handleClickOk}
      onCancel={onClickCancel}
      confirmLoading={confirmLoading}
    >
      <Row>
        <Col span={18}>
          <TimePicker.RangePicker
            format={timeFormat}
            style={{ width: '100%' }}
            onChange={(e) => {
              setStart(e[0].format(timeFormat));
              setEnd(e[1].format(timeFormat));
            }}
          />
        </Col>
        <Col span={6}>
          <PlusCircleOutlined
            style={{ fontSize: '30px', marginLeft: '10px' }}
            onClick={handleAddSchedule}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: '30px' }}>
        <Col span={24}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{ pageSize: 5 }}
          />
        </Col>
      </Row>
    </Modal>
  );
}

export default TimerModal;
