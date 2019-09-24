import {Col, Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import React from "react";

function BasicLayout(props) {
  const { Content, Sider } = Layout;
  if(props.location.pathname==="/home"||props.location.pathname==="/" || props.location.pathname==="/login")
  {
    return props.children
  }else{
    return (
      <Layout>
        <Sider trigger={null} collapsible   >
          <div className="logo"/>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <h4 className="text-white text-center my-3">Europrint</h4>
            <Menu.Item key="1">
              <Link to="/dashboard">
                <span>Buyurtmalar</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="2">
              <Link to="/payment">
                <span>To'lovlar</span>
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
}

export default BasicLayout;
