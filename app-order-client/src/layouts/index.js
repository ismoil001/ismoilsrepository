import {Col, Layout, Menu} from "antd";
import {Link} from "react-router-dom";
import React from "react";

function BasicLayout(props) {
  const pathname = props.location.pathname;
  let pageId = 1;


    if (props.location.pathname.includes("dashboard")) {
      pageId = 1
    }
    if (props.location.pathname.includes("payment")) {
      pageId = 2
    }
    if (props.location.pathname.includes("aksverka")) {
      pageId = 3
    }


  const { Content, Sider } = Layout;
  if(props.location.pathname==="/home"||props.location.pathname==="/" || props.location.pathname==="/login")
  {
    return props.children
  }else{
    return (
      <Layout>
        <Sider trigger={null} collapsible   >
          <div className="logo"/>
          <Menu theme="dark" mode="inline" defaultSelectedKeys={["" + pageId]}>
            <h4 className="text-white text-center my-3 mb-3">Europrint</h4>
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
