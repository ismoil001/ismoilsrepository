import { Layout, Menu, Icon } from 'antd';
import {Link} from "react-router-dom";
import React from "react";

const { Header, Sider, Content } = Layout;

class Index extends React.Component {
  state = {
    collapsed: false,
  };

  toggle = () => {
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };

  render() {
    return (
     <div>s</div>    );
  }
}


Index.propTypes = {};

export default Index;
