import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from "dva"
import moment from 'moment'
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  Row,
  InputNumber,
  Select,
  DatePicker,
  Table,
  Dropdown,
  Menu,
  Icon,
  Pagination, Card
} from "antd";
import './index.less'
@connect(({dashboard}) => ({dashboard}))
class Index extends PureComponent {
  render() {
    const {dashboard, dispatch, form} = this.props;
    const {modalVisible, modalType, currentItem,customerList,orderLists,page,totalElements,searchValue} = dashboard;
    const {getFieldDecorator, getFieldsValue,resetFields} = form;
    const {Option} = Select;
    const handleOpenModal = () => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          modalVisible: true,
          currentItem: '',
          modalType: "create"
        }
      })
    }
    const handleHideModal = () => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          modalVisible: false,
          currentItem: ''
        }
      })
      resetFields();
    }

    const handleSubmit = () => {
      if(modalType==="create"){
        dispatch({
          type: 'dashboard/saveOrder',
          payload: getFieldsValue()
        })
        resetFields();
      }else{
        dispatch({
          type: 'dashboard/editOrder',
          payload: {id:currentItem.id,...getFieldsValue()}
        })
        resetFields();
      }
    }

    const visibleColumns=[
      {
        title:'Date',
        dataIndex:'date',
        key:'date'
      },
      {
        title:'Product',
        dataIndex:'productName',
        key:'productName'
      },
      {
        title:'Company',
        dataIndex:'companyName',
        key:'company',
      },
      {
        title:'Count',
        dataIndex:'count',
        key:'count'
      },
      {
        title:'Price',
        dataIndex:'price',
        key:'price'
      },
      {
        title:'Sum',
        dataIndex:'sum',
        key:'sum',
      },
      {
        title:'Payment',
        dataIndex:'payments',
        key:'payment',
        render:(text,record)=>record.payments.map(item=>{
          return item.amount+" "+item.date
        })
      },
      {
        title:'Operation',
        dataIndex:'operation',
        key:'operation',
        render:(text,record)=>
          <div>
            <Button onClick={()=>onClickMenu(1,record)}>edit</Button>
            <Button onClick={()=>onClickMenu(2,record)}>delete</Button>
            <Button onClick={()=>onClickMenu(3,record)}>addpayment</Button>
          </div>


      },
    ]
    const onClickMenu = (key,item) => {
      if(key===1){
        dispatch({
          type:'dashboard/updateState',
          payload:{
            modalVisible:true,
            currentItem:item,
            modalType:"update"
          }
        })
      }
      if(key===2){
        dispatch({
          type:'dashboard/deleteOrder'
        })
      }
      if(key===3){
        dispatch({
          type:'dashboard/addPayment',
        })
      }

    };


    const onChangePage=(cpage)=>{
      dispatch({
        type:'dashboard/udpateState',
        payload:{
          page:cpage,
        }
      })
      dispatch({
        type:'dashboard/getOrders',
        payload:{
          page:cpage-1,
          size:10,
          name:searchValue,
        }
      })
    }

    const handleSearch=(event)=>{
      dispatch({
        type:'dashboard/updateState',
        payload:{
          searchValue:event.target.value
        }
      })
    }
    const searchButton=()=>{
      dispatch({
        type:'dashboard/getOrders',
        payload:{
          page:0,
          size:10,
          name:searchValue
        }
      })
    }

    return (
      <div className="admin">
        <Card>
       <Row>
         <Col span={6} offset={2}>
           <Input onClick={handleSearch}/>
         </Col>
         <Col span={2}>
           <Button onClick={searchButton}>Search</Button>
         </Col>
       </Row>
        <Row>
          <Col span={6} offset={12}>
            <h2>Admin page</h2>
          </Col>
        </Row>
        <Row>
          <Col span={20} offset={2}>
            <Button onClick={handleOpenModal}>Add Order</Button>
          </Col>
        </Row>

        <Row>
          <Col span={20} offset={2}>
            <Table dataSource={orderLists} columns={visibleColumns}/>
            <Pagination style={{position:"relative",top:"20px",left:"45%",marginBottom:"200px"}} current={page} onChange={onChangePage} pageSize={10} total={totalElements} pagination={false} />
          </Col>
        </Row>

        <Modal
          title="Add order"
          visible={modalVisible}
          onOk={handleSubmit}
          onCancel={handleHideModal}
        >

          <Form>
            <Form.Item>
              {getFieldDecorator('status', {
                initialValue: currentItem!==''?currentItem.status:"ACTIVE",
                rules: [{required: true, message: 'Please input order status!'}],
              })(
                <Select>
                  <Option value="ACTIVE">Active</Option>
                  <Option value="CLOSED">Closed</Option>
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('orderedDate', {
                initialValue:currentItem!=='' ? moment(currentItem.date,'DD-MM-YYYY'): moment(),
                rules: [{required: true, message: 'Please input date!'}],
              })(
                <DatePicker format="DD.MM.YYYY"/>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('userId', {
                initialValue:currentItem&&currentItem.userId,
                rules: [{required: true, message: 'Please select company!'}],
              })(
                <Select placeholder="Select company">
                  {customerList.map(item =>
                    <Option value={item.id} key={item.id}>{item.lastName+" "+item.firstName+" "+item.companyName+" "+item.phoneNumber}</Option>
                  )}
                </Select>,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('productName', {
                initialValue:currentItem&& currentItem.productName,
                rules: [{required: true, message: 'Please input your product name!'}],
              })(
                <Input
                  placeholder="Product name..."
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('count', {
                initialValue:currentItem&& currentItem.count,
                rules: [{required: true, message: 'Please input your product count!'}],
              })(
                <InputNumber
                  placeholder="Count..."
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('price', {
                initialValue:currentItem&&currentItem.price,
                rules: [{required: true, message: 'Please input one product price!'}],
              })(
                <InputNumber
                  placeholder="One product price..."
                />,
              )}
            </Form.Item>
          </Form>


        </Modal>
        </Card>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
