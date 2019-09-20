import React, {Component} from 'react';
import './style.less';
import {Card, Col, Row} from 'antd'


class Index extends Component {
  render() {
    return (
      <div className="weservices">
        <Row gutter={16}>
          <Col span={12}>
            <Row gutter={36}>
              <Col span={8}>
                <Card>
                  <img width="70px" height="70px" className="i"
                       src={require('../../../public/assets/images/sports-and-competition.svg')}/>
                  <p>Ipakli bosma</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/printer (1).svg')}/>
                  <p>Ofset bosma</p>
                </Card>
              </Col>
              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/scissors.svg')}/>
                  <p>Kesish</p>
                </Card>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/diamond.svg')}/>
                  <p>Ultra-binafsha rang</p>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/brochure.svg')}/>
                  <p>Bo'rttirish</p>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/postcard.svg')}/>
                  <p>Laminatsiya</p>
                </Card>
              </Col>
            </Row>
            <Row gutter={36}>
              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/report.svg')}/>
                  <p>Qog'oz kashirovka</p>
                </Card>
              </Col>

              <Col span={8}>
                <Card>
                  <img className="i" src={require('../../../public/assets/images/confidential.svg')}/>
                  <p>O'yib olish</p>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col span={12}>
            <Row>
              <Col>
                <h1>Bizning xizmatlar</h1>
                <p>Biz O'zbekiston va chet ellarda keng formatli bosma va <br/>
                  bosib chiqarish xizmatlarini taklif etamiz. Biz do'konlarni <br/>
                  tayyorlaymiz va POS materiallarini ishlab chiqaramiz. <br/>
                  Barcha xizmatlar va mahsulotlar uchun kafolat. <br/>
                  Sifatli va qimmat emas.</p>
              </Col>
            </Row>
          </Col>


        </Row>
      </div>


    );
  }
}

Index.propTypes = {};

export default Index;
