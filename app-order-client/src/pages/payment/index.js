import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'dva'
import CurrencyInput from 'react-currency-input';

import {
  Button,
  Form,
  Col,
  DatePicker,
  Modal,
  Row,
  Select,
  Table,
  Input,
  InputNumber,
  Icon,
  Popconfirm,
  Checkbox, Pagination
} from "antd/lib/index";
import moment from "moment/moment";
import {Link} from "react-router-dom";

@connect(({payment}) => ({payment}))
class Index extends PureComponent {
  render() {
    const {payment,dispatch,form} = this.props
    const {modalVisible,modalType,totalElements,page,loadingModal,isArchive,searchValue,currentItem,userList,selectedUser,payTypes,paymentList} = payment
    const {getFieldsValue,getFieldDecorator,resetFields} = form
    const onShowPaymentModal=()=>{
      resetFields();
      dispatch({
        type:'payment/updateState',
        payload:{
          modalVisible:true,
        }
      })
    }
    const handleHideModal=()=>{
      resetFields();
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
        title:'Foydalanuvchi',
        dataIndex:'user',
        key:'user',
        render:(text,record)=>record.user.companyName+" "+record.user.lastName+" "+record.user.firstName
      },{
        title:'Jami',
        dataIndex:'paySum',
        key:'paySum',
        render:(text,record)=>record.paySum.toLocaleString()
      },{
        title:'Qoldiq',
        dataIndex:'leftOver',
        key:'qoldiq',
        render:(text,record)=>record&& record.leftover.toLocaleString()
      },{
        title:'To`lov turi',
        dataIndex:'payType',
        key:'payType',
        render:(text,record)=>record.payType.name
      },{
        title:'To`lov sanasi',
        dataIndex:'payDate',
        key:'payDate'
      },{
        title:'Amal',
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


    const handleSearch = (event) => {
      dispatch({
        type: 'payment/updateState',
        payload: {
          searchValue: event.target.value
        }
      })
    }
    const searchButton = () => {
      dispatch({
        type: 'payment/queryPayment',
        payload: {
          page: 0,
          size: 10,
          name: searchValue,
          isArchive: isArchive
        }
      })
    }
    const handleArchive = (event) => {
      dispatch({
        type: 'payment/updateState',
        payload: {
          isArchive: event.target.checked
        }
      })
      dispatch({
        type: 'payment/queryPayment',
        payload: {
          page: 0,
          size: 10,
          name: searchValue,
          isArchive: event.target.checked
        }
      })
    }
    const onChangePage = (cpage) => {
      dispatch({
        type: 'payment/updateState',
        payload: {
          page: cpage,
        }
      })
      dispatch({
        type: 'payment/queryPayment',
        payload:{
          page:cpage-1,
          size:10,
          name:'',
          isArchive:isArchive
        }
      })
    }

    return (
      <div>
        <Row>

        </Row>
        <Row>
          <h2 className="text-center mb-4 mt-5"><b>To'lovlar</b></h2>
          <Col span={4} offset={18}>
            <span className='ml-5 mr-3'>Yechilgan to'lovlar</span>
            <Checkbox onChange={handleArchive} checked={isArchive}></Checkbox>
          </Col>
          <Col offset={2} span={5} className="mr-4">
            <button onClick={onShowPaymentModal} className="btn btn-dark my-3 mb-2">To`lov qo`shish</button>
          </Col>
          <Col span={5} className="mt-3  pl-3" offset={8}>
            <Input className="ml-5" onChange={handleSearch} onPressEnter={searchButton}/>
          </Col>
          <Col span={2} className="mt-3">
            <Button className="btn-dark" onClick={searchButton}>Qidiruv</Button>
          </Col>
          <Col className="pb-5" span={20} offset={2}>
            <Table dataSource={paymentList} columns={visibleColumns} pagination={false}/>
            <Pagination style={{position: "relative"}}
                        current={page}
                        onChange={onChangePage} pageSize={10} total={totalElements} />
          </Col>
        </Row>
        <Modal visible={modalVisible} onCancel={handleHideModal} onOk={onSubmitPayment} confirmLoading={loadingModal}>
          <Form style={{marginTop:"30px"}}>
            <Form.Item>
              {getFieldDecorator('userId', {
                initialValue: currentItem ? currentItem.user.id : "Mijozni tanlang",
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
            <Form.Item label="Miqdori">
              {getFieldDecorator('paySum', {
                initialValue:currentItem!==''?currentItem.paySum:0,
                rules: [{required: true, message: 'Please input sum!'}],
              })(
                <CurrencyInput className="form-control" placeholder="Miqdori" precision={''} thousandSeparator=" "/>,
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
