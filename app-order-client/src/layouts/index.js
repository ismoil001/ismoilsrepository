import {Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import React from "react";

function BasicLayout(props) {
  const { Header, Sider, Content } = Layout;

  return (
    <Layout>
      <Sider trigger={null} collapsible   >
        <div className="logo"/>
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
          <Menu.Item key="1">
            <Link to="/dashboard">
              <span>Dashboard</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/payment">
              <span>Payment</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="3">
            <Link to="/aksverka">
              <span>Aksverka</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>
      <Layout>
        <Content
          style={{
            background: '#fff',
            minHeight: 900,
          }}
        >
          {props.children}
        </Content>
      </Layout>
    </Layout>

  );
}

export default BasicLayout;
