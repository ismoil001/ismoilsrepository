import {Col, Layout, Icon, Menu} from "antd";
import {Link} from "react-router-dom";
import {LocaleProvider} from 'antd'

import enUS from 'antd/lib/locale-provider/en_US'
import ru from 'antd/lib/locale-provider/ru_RU'
import React from "react";
import {connect} from 'dva';
import { formatMessage, setLocale, getLocale, FormattedMessage } from 'umi-plugin-locale';

@connect(({app})=>({app}))
class BasicLayout extends React.Component {
  render() {
    const { SubMenu } = Menu;
    const props = this.props;
    const {app}=this.props;
    const {user}=app;

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
    if (props.location.pathname.includes("managers")) {
      pageId = 4
    }
    if (props.location.pathname.includes("settings/ourteam")) {
      pageId = 6
    }
    if (props.location.pathname.includes("settings/portfolio")) {
      pageId = 7
    }
    if (props.location.pathname.includes("settings/address")) {
      pageId = 8
    }

    const {Content, Sider} = Layout;
    if (props.location.pathname === "/home" || props.location.pathname === "/" || props.location.pathname === "/login") {
      return props.children
    } else {
      return (
        <LocaleProvider locale={getLocale() === 'en-US' ? enUS : ru}>
        <Layout>
          <Sider trigger={null} collapsible>
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
              <SubMenu
                key="5"
                title={
                  <span>
                  Sozlamalar
                </span>
                }
              > <Menu.Item key="6">
                <Link to="/settings/ourteam">
                  <span>Bizning jamoa</span>
                </Link>
              </Menu.Item>
                <Menu.Item key="7">
                  <Link to="/settings/portfolio">
                    <span>Portfolio</span>
                  </Link>
                </Menu.Item>
                <Menu.Item key="8">
                  <Link to="/settings/address">
                    <span>Manzil</span>
                  </Link>
                </Menu.Item>
              </SubMenu>


              {user.roles?user.roles.filter(item =>item.name==="ROLE_ADMIN").length===1?
                <Menu.Item key="4">
                <Link to="/managers">
                  <span>Managers</span>
                </Link>
              </Menu.Item>:"":""}
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
        </LocaleProvider>
      );
    }
  }
}

export default BasicLayout;
