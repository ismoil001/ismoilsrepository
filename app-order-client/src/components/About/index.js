import React, {Component} from 'react';
import {Button, Col, Icon, Row} from 'antd'
import './index.less'
class About extends Component {
  render() {
    return (
      <div className="about">
        <Row>
          <Col span={10} offset={2}>
            <img
            alt="example"
            src="../assets/images/logo.svg"
            />
          </Col>
          <Col span={10}>
            <h1>«EUROPRINT» tipografiyasi haqida</h1>
            <p>"EUROPRINT" o'zbek bosmaxonasi - bu sizning biznesingizga yuqori darajadagi professional yondashuv.
              Bosma mahsulotlarning ahamiyatini ortiqcha baholash qiyin.
              Axir, sizning kompaniyangizning imidji bunga bog'liq. Biz, o'zbek matbaa ijodiy uyi, Sizga eng yuqori darajadagi bosma dizayn va ishlab chiqarishni rivojlantirish bo'yicha xizmatlarni ko'rsatishga tayyormiz.
              Bizning ishimizda sifat,
              samaradorlik va mijozning vazifalariga individual yondoshishni muvaffaqiyatli birlashtiramiz.</p>
            <p>"EUROPRINT" bosmaxonasi:</p>
            <ul className="list">
              <li>
                <a href="#">Katta tajriba</a>
              </li>
              <li>
                <a href="#">Eng yangi uskunalar</a>
              </li>
              <li>
                <a href="#">Keng doiradagi xizmatlar</a>
              </li>
              <li>
                <a href="#">Buyurtmaning eng tezkor bajarilishi.</a>
              </li>
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

export default About;
