import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "dva"
import {Button, Col, Form, Input, Row} from "antd";


@connect(({settings}) => ({settings}))
class Index extends Component {

  render() {
    const {dispatch, settings, form} = this.props;
    const {company,numbers,phoneNumberValue} = settings;
    const {getFieldDecorator, getFieldsError,getFieldsValue, getFieldError, isFieldTouched} = form;
    const deleteNumber=(id)=>{
      dispatch({
        type:'settings/deleteNumber',
        payload:{
          id,
        }
      })
    }
    const handlePhoneNumberValue=(event)=>{
      dispatch({
        type:'settings/updateState',
        payload:{
          phoneNumberValue:event.target.value
        }
      })
    }
    const addPhoneNumber=()=>{
      dispatch({
        type:'settings/addPhoneNumber',
        payload:{
          number:phoneNumberValue
        }
      })
    }

    const submitForm=()=>{
      dispatch({
        type:'settings/saveCompany',
        payload:getFieldsValue()
      })
    }

    return (
      <div>
        <Row>
          <br/>
          <Col span={12} offset={6}>
            <Form>
              <Form.Item label={"Address"}>
                {getFieldDecorator('address', {
                  initialValue:company&& company.address
                })(
                  <Input placeholder="Address"/>,
                )}
              </Form.Item>
              <Form.Item label={"Email"}>
                {getFieldDecorator('email', {
                  initialValue: company&&company.email
                })(
                  <Input placeholder="Email"/>,
                )}
              </Form.Item>
              <Form.Item label={"facebook"}>
                {getFieldDecorator('facebook', {
                  initialValue:company&& company.facebook
                })(
                  <Input placeholder="facebook"/>,
                )}
              </Form.Item>
              <Form.Item label={"instagram"}>
                {getFieldDecorator('instagram', {
                  initialValue:company&& company.instagram
                })(
                  <Input placeholder="instagram"/>,
                )}
              </Form.Item>
              <Form.Item label={"youtube"}>
                {getFieldDecorator('youtube', {
                  initialValue:company&& company.youtube
                })(
                  <Input placeholder="youtube"/>,
                )}
              </Form.Item>
              <Form.Item label={"telegram"}>
                {getFieldDecorator('telegram', {
                  initialValue:company&& company.telegram
                })(
                  <Input placeholder="telegram"/>,
                )}
              </Form.Item>
              <Button type="primary" onClick={submitForm}> Save changes</Button>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={6}>
            Phone numbers of company:
            <Input onChange={handlePhoneNumberValue} value={phoneNumberValue}/><Button onClick={addPhoneNumber}>+ Add</Button>
            <ul>
              {
                numbers.map(item=><li>
                  {item.number} <Button onClick={()=>deleteNumber(item.id)}>x</Button>
                </li>)
              }
            </ul>
          </Col>
        </Row>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
