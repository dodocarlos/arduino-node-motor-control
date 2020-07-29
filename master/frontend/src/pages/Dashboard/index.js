import React, { useState, useEffect } from 'react';
import { Breadcrumb, Tabs, Tag, Card, Col, Row } from 'antd';
import { PoweroffOutlined, ClockCircleOutlined } from '@ant-design/icons';
import socketClient from '../../services/MasterSocket';
import TimerModal from '../../components/TimerModal';
import { getAllMotors } from '../../services/Motor';

function Dashboard() {
  const [data, setData] = useState([]);
  const [timerModalVisible, setTimerModalVisible] = useState(false);
  const [modalMotorId, setModalMotorId] = useState(0);

  useEffect(() => {
    const getMotors = async () => {
      const motors = await getAllMotors(1);
      setData(motors);

      socketClient.on('pin', (payload) => {
        const newData = [...motors];
        const itemIndex = newData.findIndex((item) => item.id === payload.id);
        if (itemIndex >= 0) {
          newData[itemIndex].state = payload.state;
          setData(newData);
        }
      });
    };
    getMotors();
  }, []);

  return (
    <>
      <TimerModal
        visible={timerModalVisible}
        onClickCancel={() => setTimerModalVisible(false)}
        onClickOk={() => setTimerModalVisible(false)}
        motorName={'Nome do motor'}
        motorid={modalMotorId}
      />
      <Breadcrumb style={{ margin: '16px 0' }}>
        <Breadcrumb.Item>Dashboard</Breadcrumb.Item>
      </Breadcrumb>
      <div
        className='site-layout-background'
        style={{ padding: 24, minHeight: 360 }}
      >
        <Tabs>
          <Tabs.TabPane tab='Placa 01' key='1'>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              {data.map((motor) => (
                <Col
                  className='gutter-row'
                  xs={24}
                  sm={24}
                  md={12}
                  lg={12}
                  xl={12}
                >
                  <Card
                    title={motor.name}
                    extra={
                      motor.state ? (
                        <Tag color='green'>Ligado</Tag>
                      ) : (
                        <Tag color='red'>Desligado</Tag>
                      )
                    }
                    style={{
                      borderColor: '#ccc',
                      marginBottom: '15px',
                    }}
                    actions={[
                      <PoweroffOutlined
                        onClick={() =>
                          socketClient.emit('toggle', { id: motor.id })
                        }
                      />,
                      <ClockCircleOutlined
                        onClick={() => {
                          setModalMotorId(motor.id);
                          setTimerModalVisible(true);
                        }}
                      />,
                    ]}
                  >
                    <p>Próximo horário: 00:00</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
}

export default Dashboard;
