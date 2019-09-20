import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './index.less'
import {Link} from "react-router-dom";
import {Button} from 'antd'
class Index extends Component {
  render() {
    return (
      <div>
        <Link to='login'><Button>sign in</Button></Link>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
