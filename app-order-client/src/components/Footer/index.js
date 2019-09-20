import React, {Component} from 'react';
import {Col, Icon, Row, Menu,Button,Dropdown,message} from "antd";
import './index.less'
import {Link} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.css'
function handleMenuClick(e) {
  // message.info('Click on menu item.');
  console.log('click', e);
}
class Footer extends Component {
  render() {
    const menu = (
      <Menu onClick={handleMenuClick}>
        <Menu.Item key="1">
          Uzbek
        </Menu.Item>
        <Menu.Item key="2">
          English
        </Menu.Item>
        <Menu.Item key="3">
          Russia
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="order_footer">
        <Row>
          <Col span={11} offset={2}>
            <Row>
              <Col span={8}>
                <h4>Kompaniya</h4>
                <ul>
                  <li>
                    <a href="#">Biz haqimizda</a>
                  </li>
                  <li>
                    <a href="#">Mahsulotlar</a>
                  </li>
                  <li>
                    <a href="#">Xizmatlar</a>
                  </li>
                  <li>
                    <a href="#">Bizning Mijozlar</a>
                  </li>
                  <li>
                    <a href="#">Jamoa</a>
                  </li>
                </ul>
              </Col>
              <Col span={8}>
                <h4>Xizmatlar</h4>
                <ul>
                  <li>
                    <a href="#">Ipakli bosma</a>
                  </li>
                  <li>
                    <a href="#">Ofsit bosma</a>
                  </li>
                  <li>
                    <a href="#">Kesish</a>
                  </li>
                  <li>
                    <a href="#">Ultra binafsha rang</a>
                  </li>
                  <li>
                    <a href="#">Bo'rttirish</a>
                  </li>
                  <li>
                    <a href="#">Laminatsiya</a>
                  </li>
                  <li>
                    <a href="#">Qog'oz kashirofka</a>
                  </li>
                  <li>
                    <a href="#">O'yib olish</a>
                  </li>
                </ul>
              </Col>
              <Col span={8}>
                <h4>Mijozlar uchun</h4>
                <ul>
                  <li>
                    <a href="#">Rahbariyat</a>
                  </li>
                  <li>
                    <a href="#">Tarix</a>
                  </li>
                  <li>
                    <a href="#">Yangiliklar</a>
                  </li>
                  <li>
                    <a href="#">Maketlar uchun talab</a>
                  </li>
                  <li>
                    <a href="#">Aloqa</a>
                  </li>
                  <li>
                    <a href="#">Biz bilan aloqa</a>
                  </li>
                </ul>
              </Col>
            </Row>
            <Row className="icon-dropdown">
              <Col span={8}>
                <Dropdown overlay={menu}>
                  <Button>
                    Uzbek <Icon type="down" />
                  </Button>
                </Dropdown>
              </Col>
              <Col span={8}>
                <ul>
                  <li className="d-inline-block icon-wrap">
                    <Link to="#">
                      <span className="icon icon-telegram"></span>
                    </Link>
                  </li>
                  <li className="d-inline-block icon-wrap">
                    <Link to="#">
                      <span className="icon icon-instagram"></span>
                    </Link>
                  </li>
                  <li className="d-inline-block icon-wrap">
                    <Link to="#">
                      <span className="icon icon-fecebook"></span>
                    </Link>
                  </li>
                  <li className="d-inline-block icon-wrap">
                    <Link to="#">
                      <span className="icon icon-youtube"></span>
                    </Link>
                  </li>
                </ul>
              </Col>

            </Row>
          </Col>
          <Col span={8} offset={3}  className="list">
            <h4>Aloqa</h4>
            <ul>
              <li>
                <a href="#"> (+99891)</a>
                <h1>360-77-00</h1>
              </li>
              <li>
                <a href="#"> (+99891)</a>
                <h1>204-11-00</h1>
              </li>
              <li>
                <a href="#"> (+99873)</a>
                <h1>543-55-55</h1>
              </li>
            </ul>
            <Row>
              <Col span={12} className="locetion">
                <ul>
                  <li>
                    <a href="#">
                      <Icon type="environment"/>140100.
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      O'zbekiston R, Farg'ona viloyati,
                    </a>
                  </li>
                  <li>
                    <a href="#">
                      Qo'qon sh. Usta bozor k, 1B uy.
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row>
          <Col span={15} offset={2} className="local">
            <a href="#">
              © 2005 - 2019 europrint.uz tipografiyasi | Personal Development Process
            </a>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Footer;
