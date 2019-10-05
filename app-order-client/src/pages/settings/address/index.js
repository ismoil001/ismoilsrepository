import React, {Component} from 'react';
import {connect} from "dva"
import {Button, Col, Form, Input, Row} from "antd";


@connect(({settings}) => ({settings}))
class Index extends Component {

  render() {
    const {dispatch, settings, form} = this.props;
    const {company, numbers, phoneNumberValue} = settings;
    const {getFieldDecorator, getFieldsError, getFieldsValue, getFieldError, isFieldTouched} = form;
    const deleteNumber = (id) => {
      dispatch({
        type: 'settings/deleteNumber',
        payload: {
          id,
        }
      })
    }
    const handlePhoneNumberValue = (event) => {
      dispatch({
        type: 'settings/updateState',
        payload: {
          phoneNumberValue: event.target.value
        }
      })
    }
    const addPhoneNumber = () => {
      dispatch({
        type: 'settings/addPhoneNumber',
        payload: {
          number: phoneNumberValue
        }
      })
    }

    const submitForm = () => {
      dispatch({
        type: 'settings/saveCompany',
        payload: getFieldsValue()
      })
    }

    return (
      <div>
        <Row>
          <br/>
          <Col span={20} offset={2}>
            <h2 className="text-center my-3 mb-5"><b>Manzillar</b></h2>
            <Form>
              <Row>
                <Col span={12}>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('address', {
                        initialValue: company && company.address
                      })(
                        <Input placeholder="Address"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('email', {
                        initialValue: company && company.email
                      })(
                        <Input placeholder="Email"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('facebook', {
                        initialValue: company && company.facebook
                      })(
                        <Input placeholder="facebook"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('instagram', {
                        initialValue: company && company.instagram
                      })(
                        <Input placeholder="instagram"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('youtube', {
                        initialValue: company && company.youtube
                      })(
                        <Input placeholder="youtube"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('telegram', {
                        initialValue: company && company.telegram
                      })(
                        <Input placeholder="telegram"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('customerCount', {
                        initialValue: company && company.countCustomer
                      })(
                        <Input placeholder="Customers count"/>,
                      )}
                    </Form.Item>
                  </Col>
                </Col>
                <Col span={12}>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('addressRu', {
                        initialValue: company && company.addressRu
                      })(
                        <Input placeholder="Address Ru"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('masterCount', {
                        initialValue: company && company.masterCount
                      })(
                        <Input placeholder="Master count"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('orderCount', {
                        initialValue: company && company.orderCount
                      })(
                        <Input placeholder="Order count"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('phoneNumber1', {
                        initialValue: company && company.phoneNumber1
                      })(
                        <Input placeholder="Phone number 1"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('phoneNumber2', {
                        initialValue: company && company.phoneNumber2
                      })(
                        <Input placeholder="Phone number 2"/>,
                      )}
                    </Form.Item>
                  </Col>
                  <Col span={24} className="px-3">
                    <Form.Item>
                      {getFieldDecorator('phoneNumber3', {
                        initialValue: company && company.phoneNumber3
                      })(
                        <Input placeholder="Phone number 3"/>,
                      )}
                    </Form.Item>
                  </Col>
                </Col>
              </Row>
              <Col span={4} offset={20} className="text-align-right">
                <Button  className="btn-dark" onClick={submitForm}> O`zgarishlarni saqlash</Button>
              </Col>
            </Form>
          </Col>
        </Row>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
