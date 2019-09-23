import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from'dva'
import {Button, Form, Col, DatePicker, Modal, Row, Select, Table, Input, InputNumber, Icon, Popconfirm} from "antd";
import moment from "moment";
import {Link} from "react-router-dom";

@connect(({payment}) => ({payment}))
class Index extends PureComponent {
  render() {
    const {payment,dispatch,form} = this.props
    const {modalVisible,modalType,currentItem,userList,selectedUser,payTypes,paymentList} = payment
    const {getFieldsValue,getFieldDecorator} = form
    const onShowPaymentModal=()=>{
      dispatch({
        type:'payment/updateState',
        payload:{
          modalVisible:true,
        }
      })
    }
    const handleHideModal=()=>{
      dispatch({
        type:'payment/updateState',
        payload:{
          modalVisible:false,
          modalType:"create",
          currentItem:''
        }
      })
    }

    const onSearch=(val)=>{
      if(val===''){
        dispatch({
          type:'payment/updateState',
          payload:{
            userList:[]
          }
        })
      }else{
        dispatch({
          type:'payment/searchUser',
          payload:val
        })
      }

    }

    const onSubmitPayment=()=>{
      dispatch({
        type:'payment/savePayment',
        payload:getFieldsValue()
      })
    }

    const visibleColumns=[
      {
        title:'User',
        dataIndex:'user',
        key:'user',
        render:(text,record)=>record.user.companyName+" "+record.user.lastName+" "+record.user.firstName
      },{
        title:'Amount',
        dataIndex:'paySum',
        key:'paySum'
      },{
        title:'PayType',
        dataIndex:'payType',
        key:'payType',
        render:(text,record)=>record.payType.name
      },{
        title:'PayDate',
        dataIndex:'payDate',
        key:'payDate'
      },{
        title:'Operation',
        dataIndex:'opt',
        key:'opt',
        render:(text,record)=>
          <Popconfirm placement="topLeft" title="Tasdiqlash" onConfirm={()=>deletePayment(record.id)} okText="Yes"
                      cancelText="No">
            <Button><Icon type={"delete"}/></Button>
          </Popconfirm>
      },
    ]

    const deletePayment=(id)=>{
      dispatch({
        type:'payment/deletePayment',
        payload:id
      })
    }

    return (
      <div>
        <Row>
          <Col span={6} offset={2}>
            <Button onClick={onShowPaymentModal}>Add payment</Button>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <Table dataSource={paymentList} columns={visibleColumns}/>
          </Col>
        </Row>
        <Modal visible={modalVisible} onCancel={handleHideModal} onOk={onSubmitPayment}>
          <Form style={{marginTop:"30px"}}>
            <p>Select user:</p>
            <Form.Item>
              {getFieldDecorator('userId', {
                initialValue: currentItem !== '' ? currentItem.user.id : "",
                rules: [{required: true, message: 'Please select user!'}],
              })(
                <Select placeholder={"User"} onSearch={onSearch} showSearch  optionFilterProp="children">
                  {userList.map(item=><Select.Option key={item.id} value={item.id}>{item.companyName+" "+item.lastName+" "+item.firstName+" "+item.phoneNumber}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('payTypeId', {
                initialValue: currentItem !== '' ? currentItem.payType.id : 10,
                rules: [{required: true, message: 'Please select payType!'}],
              })(
                <Select>
                  {payTypes.map(item=><Select.Option key={item.id} value={item.id}>{item.name}</Select.Option>)}
                </Select>
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('payDate', {
                initialValue: currentItem !== '' ? moment(currentItem.payDate, 'DD-MM-YYYY') : moment(),
                rules: [{required: true, message: 'Please input date!'}],
              })(
                <DatePicker format="DD.MM.YYYY"/>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('paySum', {
                initialValue:currentItem!==''?currentItem.paySum:0,
                rules: [{required: true, message: 'Please input sum!'}],
              })(
                <InputNumber placeholder={"Amount"}/>,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
