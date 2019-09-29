import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Col, Input, Row, Select, Table} from "antd";
import {connect} from "dva"

@connect(({aksverka}) => ({aksverka}))
class Index extends Component {
  render() {

    const {aksverka,dispatch} = this.props;
    const {userList,aksverkaList,saldo, sumPayment, sumOrderCost, sumCount} = aksverka;

    const handleScroll = () => {
      let myDiv = document.getElementById("nL");
      if (myDiv.offsetHeight + myDiv.scrollTop + 1 >= myDiv.scrollHeight) {
        alert("Bas qil")
      }
    }
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
        title: 'Sana',
        dataIndex:'date',
        key:'date'
      },{
        title:'Maxsulot nomi',
        dataIndex:'productName',
        key:'productName'
      },{
        title:<div><div className="d-inline-block" id="soni" ></div> Soni</div> ,
        dataIndex:'productCount',
        key:'count',
        render:(text,record)=>record.productCount && record.productCount.toLocaleString()
      },{
        title:'Narxi',
        dataIndex:'productPrice',
        key:'price',
        render:(text,record)=>record.productPrice && record.productPrice.toLocaleString()

      },{
        title:<div><div className="d-inline-block" id="summasi" ></div> Summasi</div>,
        dataIndex:'sum',
        key:'price',
        render:(text,record)=>record.sum &&record.sum.toLocaleString()

      },{
        title:<div><div className="d-inline-block" id="tolov" ></div> To'lov</div>,
        dataIndex:'paymentSum',
        key:'payment',
        render:(text,record)=>record.paymentSum && record.paymentSum.toLocaleString()
      }
    ]

    return (
      <div className="my-5" id="tableMy">
        <Row>
          <Col span={12} offset={2}>
            <Select style={{width:"300px"}} placeholder={"User"} onSearch={onSearch} showSearch  optionFilterProp="children" onChange={handleSelect}>
              {userList.map(item=><Select.Option key={item.id} value={item.id}>{item.companyName+" "+item.lastName+" "+item.firstName+" "+item.phoneNumber}</Select.Option>)}
            </Select>
          </Col>
        </Row>
        <Row id="aksverka" className="mb-3 mt-3 offset-1 p-1">
          <Col span={5} className="aksverka-header ml-1">
          <div className="bg-white border-1" >
            <h3 className=" text-center font-weight-bold">{sumCount.toLocaleString()}</h3>
            <p className=" text-center">
            <div className="d-inline-block" id="soni" ></div>Soni</p>
          </div>
        </Col>
          <Col span={5} className="aksverka-header ml-4">
            <div className="bg-white border-1" >
              <h3 className="text-center font-weight-bold">{sumOrderCost.toLocaleString()}</h3>
              <p className="text-center">
                <div className="d-inline-block" id="summasi" ></div>Summasi</p>
            </div>
          </Col>
          <Col span={5} className="aksverka-header ml-4">
            <div className="bg-white border-1" >
              <h3 className="text-center font-weight-bold">{sumPayment.toLocaleString()}</h3>
              <p className="text-center">
                <div className="d-inline-block" id="tolov" ></div>To'lov</p>
            </div>
          </Col>
          <Col span={5} className={saldo>=0?"aksverka-header ml-4 bg-plus":"aksverka-header ml-4 bg-minus"}>
            <div className="border-1" >
              <h3 className="text-center font-weight-bold">{saldo.toLocaleString()}</h3>
              <p className="text-center">Saldo</p>
            </div>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <Table onScroll={() => handleScroll()} dataSource={aksverkaList} columns={visibleColumns} pagination={false}/>
          </Col>
        </Row>


      </div>
    );
  }
}

Index.propTypes = {};

export default Index;
