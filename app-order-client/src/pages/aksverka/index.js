import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Col, Input, Row, Select, Table} from "antd";
import {connect} from "dva"

@connect(({aksverka}) => ({aksverka}))
class Index extends Component {
  render() {

    const {aksverka,dispatch} = this.props;
    const {userList,aksverkaList,saldo, sumPayment, sumOrderCost, sumCount} = aksverka;

    const onSearch=(val)=>{
      if(val===''){
        dispatch({
          type:'aksverka/updateState',
          payload:{
            userList:[]
          }
        })
      }else{
        dispatch({
          type:'aksverka/searchUser',
          payload:val
        })
      }
    }

    const handleSelect=(val)=>{
      dispatch({
        type:'aksverka/do',
        payload:val
      })
    }
    const visibleColumns = [
      {
        title:'Sana',
        dataIndex:'date',
        ket:'date'
      },{
        title:'Maxsulot nomi',
        dataIndex:'productName',
        ket:'productName'
      },{
        title:'Soni',
        dataIndex:'productCount',
        ket:'count'
      },{
        title:'Narxi',
        dataIndex:'productPrice',
        ket:'price'
      },{
        title:'Narxi',
        dataIndex:'sum',
        ket:'price'
      },{
        title:"To'lov",
        dataIndex:'paymentSum',
        ket:'payment'
      }
    ]

    return (
      <div>
        <Row>
          <Col span={12} offset={2}>
            <Select style={{width:"300px"}} placeholder={"User"} onSearch={onSearch} showSearch  optionFilterProp="children" onChange={handleSelect}>
              {userList.map(item=><Select.Option key={item.id} value={item.id}>{item.companyName+" "+item.lastName+" "+item.firstName+" "+item.phoneNumber}</Select.Option>)}
            </Select>
          </Col>
        </Row>
        <Row className="mb-3 mt-3">
          <Col span={5} offset={4}>count: {sumCount}</Col>
          <Col span={5}>sum order price: {sumOrderCost}</Col>
          <Col span={5}>payment: {sumPayment}</Col>
          <Col span={5}>saldo: {saldo}</Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <Table dataSource={aksverkaList} columns={visibleColumns} pagination={false}/>
          </Col>
        </Row>


      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
