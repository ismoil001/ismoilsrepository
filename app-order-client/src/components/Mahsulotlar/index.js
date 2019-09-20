import React, {Component} from 'react';
import {Button, Col, Icon, Modal, Row, Table, Form, Input} from 'antd'
import './index.less'
import PropTypes from 'prop-types';

class Index extends Component {

  render() {

    const {onHover, isHovered, onLeave} = this.props;

    return (
      <div className="products">
        <h1 className="sarlavha"><b>MAHSULOTLAR</b></h1>
        <Row className="row-1">
          {/*{isHovered ?*/}
          {/*<div className="card">*/}
          {/*<img className="image" src={require('../../../public/assets/2.svg')}/>*/}
          {/*<div className="black"></div>*/}
          {/*</div>*/}
          {/*:*/}

          {/*onMouseOver={onHover}*/}
          <img className="i" src={require('../../../public/assets/1.svg')}/>}
          <img className="i" src={require('../../../public/assets/2.svg')}/>
          <img className="i" src={require('../../../public/assets/3.svg')}/>
          <img className="i" src={require('../../../public/assets/4.svg')}/>
        </Row>
        <Row className="row-2">
          <img className="i" src={require('../../../public/assets/5.svg')}/>
          <img className="i" src={require('../../../public/assets/6.svg')}/>
          <img className="i" src={require('../../../public/assets/1.svg')}/>
          <img className="i" src={require('../../../public/assets/7.svg')}/>
        </Row>
        <Row className="row-3">
          <img className="i" src={require('../../../public/assets/8.svg')}/>
          <img className="i" src={require('../../../public/assets/9.svg')}/>
          <img className="i" src={require('../../../public/assets/10.svg')}/>
          <img className="i" src={require('../../../public/assets/11.svg')}/>
        </Row>
        {/*<Row>*/}
        {/*<Button>Buyurtma berish</Button>*/}
        {/*</Row>*/}
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
