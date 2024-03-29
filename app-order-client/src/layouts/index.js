import ant from 'antd';
import {Link} from "react-router-dom";
import enUS from 'antd/lib/locale-provider/en_US'
import ru from 'antd/lib/locale-provider/ru_RU'
import React from "react";
import {connect} from 'dva';
import {formatMessage, FormattedMessage, getLocale, setLocale} from 'umi-plugin-locale';
const {Menu,Layout,LocaleProvider} = ant;
@connect(({app}) => ({app}))
class BasicLayout extends React.Component {
  render() {
    const {SubMenu} = Menu;
    const props = this.props;
    const {app} = this.props;
    const {user} = app;

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
    if (props.location.pathname !== "/dashboard" && props.location.pathname !== "/payment" && props.location.pathname !== "/managers" && props.location.pathname !== "/aksverka" && props.location.pathname !== "/settings/address" && props.location.pathname !== "/settings/ourteam" && props.location.pathname !== "/settings/portfolio") {
      return props.children
    } else {
      return (
        <LocaleProvider locale={getLocale() === 'en-US' ? enUS : ru}>
          <Layout>
            <Sider trigger={null} collapsible>
              <Menu style={{position: 'fixed', width: '200px'}} theme="dark" mode="inline"
                    defaultSelectedKeys={["" + pageId]}>
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


                {user.roles ? user.roles.filter(item => item.name === "ROLE_ADMIN").length === 1 ?
                  <Menu.Item key="4">
                    <Link to="/managers">
                      <span>Managerlar</span>
                    </Link>
                  </Menu.Item> : "" : ""}
                <Menu.Item key="9">
                  <Link to="/">
                    <span>Bosh sahifa</span>
                  </Link>
                </Menu.Item>
              </Menu>
            </Sider>
            <Layout
              style={{
                background: '#fff',
              }}>
              <Content
                className="layout-content"
                style={{
                  background: '#fff',
                  minHeight: '829px',
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
