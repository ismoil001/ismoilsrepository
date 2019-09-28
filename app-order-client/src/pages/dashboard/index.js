import React, {PureComponent} from 'react';
import {connect} from "dva"
import moment from 'moment'
import PaymentModal from '../../components/PaymentModal/index'
import CurrencyInput from 'react-currency-input';
import {
  Menu,
  Icon,
  Dropdown,
  Button,
  Checkbox,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  Pagination,
  Popconfirm,
  Row,
  Select,
  Table,
  Tabs
} from "antd";
import './index.less'



@connect(({dashboard}) => ({dashboard}))
class Index extends PureComponent {

  render() {
    const {dashboard, dispatch, form} = this.props;
    const {modalVisible, modalType,modalLoading, currentItem, customerList, currentItemPaymentSum, ismine, archiveData, orderLists, page, totalElements, searchValue, paymentModalVisible} = dashboard;
    const {getFieldDecorator,getFieldsValue, resetFields,setFieldsValue} = form;
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
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          modalLoading: true
        }
      })
      if (modalType === "create") {
        dispatch({
          type: 'dashboard/saveOrder',
          payload: getFieldsValue()
          // item.amount.replace(/\s/g,''))
        })
        resetFields();
      } else {
        dispatch({
          type: 'dashboard/editOrder',
          payload: {id: currentItem.id, ...getFieldsValue()}
        })
        resetFields();
      }
    }

    const visibleColumns = [
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: 'Product',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Company',
        dataIndex: 'companyName',
        key: 'company',
      },
      {
        title: 'Client',
        dataIndex: 'userFullName',
        key: 'user',
      },
      {
        title: 'Manager',
        dataIndex: 'managerFullName',
        key: 'manager',
      },
      {
        title: 'Count',
        dataIndex: 'count',
        key: 'count',
        render:(text,record)=>record.count.toLocaleString()
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price',
        render:(text,record)=>record.price.toLocaleString()

      },
      {
        title: 'Sum',
        dataIndex: 'sum',
        key: 'sum',
        render:(text,record)=>record.sum.toLocaleString()
      },
      {
        title: 'Qoldiq',
        dataIndex: 'qoldiq',
        key: 'qoldiq',
        render: (text, record) => {
          let a = 0;
          record.payments.map(item => {
            a += item.amount
          })
          return (record.sum - a).toLocaleString()
        }
      },
      {
        title: 'Payment',
        dataIndex: 'payments',
        key: 'payment',
        render: (text, record) => record.payments.map(item => {
          return <div><span><b>{item.amount} $</b>&nbsp; {item.date}</span><br/>
          </div>
        })
      },
      {
        title: 'Operation',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          <div>
            <Dropdown overlay={<Menu>
        <Menu.Item className="p-0 my-1 mx-2">
          <Button className="border-0 text-center w-100" onClick={() => onClickMenu(1, record)}>edit</Button>
        </Menu.Item>
        <Menu.Item className="p-0 my-1 mx-2">
          <Popconfirm placement="topLeft" title="Tasdiqlash" onConfirm={() => onClickMenu(2, record)} okText="Yes"
                      cancelText="No">
            <Button className="border-0 text-center w-100">delete</Button>
          </Popconfirm>
        </Menu.Item>
              {record.status==="ACTIVE"?        <Menu.Item className="p-0 my-1 mx-2">
                <Button className="border-0 text-center w-100" onClick={() => onClickMenu(3, record)}>Archive</Button>
              </Menu.Item>:
                <Menu.Item className="p-0 my-1 mx-2">
                  <Button className="border-0 text-center w-100" onClick={() => onClickMenu(4, record)}>Active</Button>
                </Menu.Item>
              }
      </Menu>}>
              <a className="ant-dropdown-link" >
                <Icon type="dash" /> <Icon type="down" />
              </a>
            </Dropdown>
          </div>
      },
    ]
    const onClickMenu = (key, item) => {
      let s = 0;
      item.payments.map(i => {
        s += i.amount
      })
      if (key === 1) {
        dispatch({
          type: 'dashboard/updateState',
          payload: {
            modalVisible: true,
            currentItem: item,
            modalType: "update"
          }
        })
      }
      if (key === 2) {
        dispatch({
          type: 'dashboard/deleteOrder',
          payload: item.id
        })
      }
      if (key === 3) {
        dispatch({
          type: 'dashboard/setStatusOfOrder',
          payload: item.id
        })

      }
      if(key===4){
        dispatch({
          type: 'dashboard/setStatusOfOrder1',
          payload: item.id
        })
      }

    };


    const onChangePage = (cpage) => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          page: cpage,
        }
      })
      dispatch({
        type: 'dashboard/getOrders',
        payload: {
          page: cpage - 1,
          size: 10,
          name: searchValue,
        }
      })
    }

    const handleSearch = (event) => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          searchValue: event.target.value
        }
      })
    }
    const searchButton = () => {
      dispatch({
        type: 'dashboard/getOrders',
        payload: {
          page: 0,
          size: 10,
          name: searchValue,
          status: 'active',
          ismine: false
        }
      })
    }

    const hidePaymentModal = () => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          paymentModalVisible: false,
        }
      })
    }
    const saveOrderPayment = (formData) => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          modalLoading: true
        }
      })
      dispatch({
        type: 'dashboard/saveOrderPayment',
        payload: {...formData, orderId: currentItem.id}
      })
    }

    const handleIsMine = (event) => {
      dispatch({
        type: 'dashboard/updateState',
        payload: {
          ismine: event.target.checked
        }
      })
      dispatch({
        type: 'dashboard/getOrders',
        payload: {
          page: 0,
          size: 10,
          name: searchValue,
          status: 'active',
          ismine: event.target.checked
        }
      })
    }

    const handleTab = (key) => {
      if (key === 2 + '') {
        dispatch({
          type: 'dashboard/getOrders',
          payload: {
            page: 0,
            size: 10,
            name: searchValue,
            status: 'notactive',
            ismine: false
          }
        })
      }
      if (key === 1 + '') {
        dispatch({
          type: 'dashboard/getOrders',
          payload: {
            page: 0,
            size: 10,
            name: searchValue,
            status: 'active',
            ismine: ismine
          }
        })
      }
    }

    const onSearchCompany=(val)=>{
        if(val===''){
          dispatch({
            type:'dashboard/updateState',
            payload:{
              customerList:[]
            }
          })
        }else{
          dispatch({
            type:'dashboard/searchUser',
            payload:val
          })
      }
    }

    return (
      <div className="admin">
        <Tabs onChange={handleTab} className="pb-5 pt-1">
          <Tabs.TabPane tab="All orders" key="1">
            <div>
              <h2 className="text-center my-3"><b>Buyurtmalar</b></h2>
              <Row>
                <Col span={4} offset={18}>
                  <span className='ml-5 mr-3'>Mening buyurtmalarim</span>
                  <Checkbox onChange={handleIsMine} checked={ismine}></Checkbox>
                </Col>
                <Col offset={2} span={5} className="mr-4">
                  <button onClick={handleOpenModal} className="btn btn-dark mt-3">Add Order</button>
                </Col>
                <Col span={5} className="mt-3  pl-3" offset={8}>
                  <Input className="ml-5" onChange={handleSearch}/>
                </Col>
                <Col span={2} className="mt-3">
                  <Button className="btn-dark" onClick={searchButton}>Search</Button>
                </Col>
              </Row>

              <Row className="my-4">
                <Col span={20} offset={2}>
                  <Table dataSource={orderLists} columns={visibleColumns} pagination={false}/>
                  <Pagination style={{position: "relative", top: "20px", left: "45%", marginBottom: "200px"}}
                              current={page}
                              onChange={onChangePage} pageSize={10} total={totalElements} pagination={false}/>
                </Col>
              </Row>

              <PaymentModal modalVisible={paymentModalVisible} item={currentItem} itemPaySum={currentItemPaymentSum}
                            onHideModal={hidePaymentModal}
                            onSave={saveOrderPayment} confirmLoading={modalLoading}/>
              <Modal
                title="Add order"
                visible={modalVisible}
                onOk={handleSubmit}
                onCancel={handleHideModal}
                confirmLoading={modalLoading}
              >

                <Form>
                  <Form.Item>
                    {getFieldDecorator('status', {
                      initialValue: currentItem !== '' ? currentItem.status : "ACTIVE",
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
                      initialValue: currentItem !== '' ? moment(currentItem.date, 'DD-MM-YYYY') : moment(),
                      rules: [{required: true, message: 'Please input date!'}],
                    })(
                      <DatePicker format="DD.MM.YYYY"/>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('userId', {
                      initialValue: currentItem && currentItem.userId,
                      rules: [{required: true, message: 'Please select company!'}],
                    })(
                      <Select placeholder="User" onSearch={onSearchCompany} showSearch  optionFilterProp="children">
                        {customerList.map(item =>
                          <Option value={item.id}
                                  key={item.id}>{item.lastName + " " + item.firstName + " " + item.companyName + " " + item.phoneNumber}</Option>
                        )}
                      </Select>,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('productName', {
                      initialValue: currentItem && currentItem.productName,
                      rules: [{required: true, message: 'Please input your product name!'}],
                    })(
                      <Input
                        className="form-control"
                        placeholder="Product name..."
                      />,
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('count', {
                      initialValue: currentItem && currentItem.count,
                      rules: [{required: true, message: 'Please input your product count!'}],
                    })(
                      <CurrencyInput  className="form-control" precision={''} thousandSeparator=" "/>
                    )}
                  </Form.Item>
                  <Form.Item>
                    {getFieldDecorator('price', {
                      initialValue: currentItem && currentItem.price,
                      rules: [{required: true, message: 'Please input one product price!'}],
                    })(
                      <CurrencyInput  className="form-control" precision={''} thousandSeparator=" "/>
                    )}
                  </Form.Item>
                </Form>


              </Modal>
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Archive" key="2">
            <Col span={20} offset={2}>

              <Table dataSource={orderLists} columns={visibleColumns} pagination={false}/>
              <Pagination style={{position: "relative", top: "20px", left: "45%", marginBottom: "200px"}}
                          current={page}
                          onChange={onChangePage} pageSize={10} total={totalElements} pagination={false}/>

            </Col>

          </Tabs.TabPane>
        </Tabs>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
