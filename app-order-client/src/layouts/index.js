import {Col, Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import React from "react";

function BasicLayout(props) {
  const { Header, Sider, Content } = Layout;
  const {pathname}=props.location
let showDashbord=false;
  if(pathname.includes("admin")){
    showDashbord=true
  }
  return (
    <div>
      {showDashbord?
        <Layout>
          <Sider trigger={null} collapsible   >
            <div className="logo"/>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
              <h4 className="text-white text-center my-3">Europrint</h4>
              <Menu.Item key="1">
                <Link to="/admin/dashboard">
                  <span>Dashboard</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="2">
                <Link to="/admin/payment">
                  <span>Payment</span>
                </Link>
              </Menu.Item>
              <Menu.Item key="3">
                <Link to="/admin/aksverka">
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
        </Layout>:props.children}

    </div>

  );
}

export default BasicLayout;
