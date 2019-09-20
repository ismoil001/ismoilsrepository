import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './style.less';
import {Col, Row} from 'antd'

class Index extends Component {
  render() {
    return (
      <div className="whywe">
        <Row>
          <Col>
            <h1 className="klass">Nima uchun biz?</h1>
          </Col>
        </Row>

        <Row className="place">
          <Col span={12}>
            <img className="i" src={require('../../../public/assets/images/Soat.svg')}/>
          </Col>
          <Col span={12}>
            <h2 className="firstRow">1. Samaradorlik</h2>
            <p>
              Har qanday murakkablikdagi buyurtmalarni <br/>
              tezkor hisoblash. Ofset usulida ishlash <br/>
              24 soat davom etadi.
            </p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h2 className="secondRow">2. 100% sifat</h2>
            <p>
              Eng yangi uskunalar, sifatli materiallar, <br/> professional xodimlar.
            </p>
          </Col>
          <Col span={12}>
            <img className="i" src={require('../../../public/assets/images/Fotoapp.svg')}/>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <img className="i" src={require('../../../public/assets/images/Sovga.svg')}/>
          </Col>
          <Col span={12}>
            <h2 className="thirdRow">3. Qulay narx </h2>
            <p>
              Xarajatlarni minimallashtirish bizga bozor <br/> narxidan past narxlarda raqobatdosh <br/> ustunlikni
              beradi.
            </p>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <h2 className="fourthRow">4. O'z ishlab chiqarish</h2>
            <p>
              Bizning bosmaxona zamonaviy <br/> poligrafiya uskunalari bilan jihozlangan <br/> ishlab chiqarish
              ustaxonasiga <br/> asoslanadi.
            </p>
          </Col>
          <Col span={12}>
            <img className="i" src={require('../../../public/assets/images/Printer.svg')}/>
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <img className="i" src={require('../../../public/assets/images/Qalam.svg')}/>
          </Col>
          <Col span={12}>
            <h2 className="lastRow">5. Dizayn ofisi va dizayn studiyasi</h2>
            <p>
              Ular bizga g'oyalar bosqichida buyurtma <br/> olishga va har qanday g'oyani birinchi darajali <br/> tayyor
              mahsulotga tarjima qilishga imkon <br/> beradi.
            </p>
          </Col>
        </Row>
      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
