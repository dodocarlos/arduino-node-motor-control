import React from 'react';
import { Layout, Menu } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Dashboard from '../Dashboard';

const { Header, Content, Footer, Sider } = Layout;

class App extends React.Component {
  state = {
    collapsed: true,
  };

  onCollapse = (collapsed) => {
    console.log(collapsed);
    this.setState({ collapsed });
  };

  render() {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Header
        // collapsible
        // collapsed={this.state.collapsed}
        // onCollapse={this.onCollapse}
        >
          <div className='logo' />
          <Menu theme='dark' defaultSelectedKeys={['1']} mode='horizontal'>
            <Menu.Item key='1' icon={<DashboardOutlined />}>
              Início
            </Menu.Item>
          </Menu>
        </Header>
        <Layout className='site-layout'>
          <Header className='site-layout-background' style={{ padding: 0 }} />
          <Content style={{ margin: '0 16px' }}>
            <Router>
              <Route exact path='/'>
                <Dashboard />
              </Route>
            </Router>
          </Content>
          <Footer style={{ textAlign: 'center' }}>
            Controle de motores ©2020 Criado por Carlos E. Pegoretti
          </Footer>
        </Layout>
      </Layout>
    );
  }
}

export default App;
