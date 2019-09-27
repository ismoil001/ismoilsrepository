import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
@connect(({app})=>({app}))
class App extends Component {
  render() {
    const {app}=this.props;
    const {user}=app;
    return (
      <div>

      </div>
    );
  }
}

App.propTypes = {};

export default App;
