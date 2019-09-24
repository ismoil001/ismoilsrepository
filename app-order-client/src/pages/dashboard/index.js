import React, {PureComponent} from 'react';
import {connect} from "dva"
import moment from 'moment'
import PaymentModal from '../../components/PaymentModal/index'
import {
  Button,
  Card,
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
    const {modalVisible, modalType, currentItem, customerList, ismine, archiveData, orderLists, page, totalElements, searchValue, paymentModalVisible} = dashboard;
    const {getFieldDecorator, getFieldsValue, resetFields} = form;
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
      if (modalType === "create") {
        dispatch({
          type: 'dashboard/saveOrder',
          payload: getFieldsValue()
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
        key: 'count'
      },
      {
        title: 'Price',
        dataIndex: 'price',
        key: 'price'
      },
      {
        title: 'Sum',
        dataIndex: 'sum',
        key: 'sum',
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
          return record.sum - a
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
            <Button onClick={() => onClickMenu(1, record)}>edit</Button>
            <Popconfirm placement="topLeft" title="Tasdiqlash" onConfirm={() => onClickMenu(2, record)} okText="Yes"
                        cancelText="No">
              <Button>delete</Button>
            </Popconfirm>
            <Button onClick={() => onClickMenu(3, record)}>addpayment</Button>
          </div>


      },
    ]
    const onClickMenu = (key, item) => {
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
          type: 'dashboard/updateState',
          payload: {
            paymentModalVisible: true,
            currentItem: item
          }
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
      if (key === 2) {
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
    }

    return (
      <div className="admin">
        <Tabs onChange={handleTab} className="pb-5 pt-1">
          <Tabs.TabPane tab="All orders" key="1">
            <div>
              <h2 className="text-center my-3"><b>Buyurtmalar</b></h2>
              <Row>
                <Col span={4} offset={18}>
                  <span className='ml-5 mr-3'>Menin buyurmalarim</span>
                <Checkbox onChange={handleIsMine} checked={ismine}></Checkbox>
              </Col>
                <Col offset={2} span={5} className="mr-4">
                  <Button onClick={handleOpenModal} className="btn-dark mt-3">Add Order</Button>
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
                  <Table dataSource={orderLists} columns={visibleColumns}/>
                  <Pagination style={{position: "relative", top: "20px", left: "45%", marginBottom: "200px"}}
                              current={page}
                              onChange={onChangePage} pageSize={10} total={totalElements} pagination={false}/>
                </Col>
              </Row>

                <PaymentModal modalVisible={paymentModalVisible} onHideModal={hidePaymentModal}
                              onSave={saveOrderPayment}/>
                <Modal
                  title="Add order"
                  visible={modalVisible}
                  onOk={handleSubmit}
                  onCancel={handleHideModal}
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
                        <Select placeholder="Select company">
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
                          placeholder="Product name..."
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('count', {
                        initialValue: currentItem && currentItem.count,
                        rules: [{required: true, message: 'Please input your product count!'}],
                      })(
                        <InputNumber
                          placeholder="Count..."
                        />,
                      )}
                    </Form.Item>
                    <Form.Item>
                      {getFieldDecorator('price', {
                        initialValue: currentItem && currentItem.price,
                        rules: [{required: true, message: 'Please input one product price!'}],
                      })(
                        <InputNumber
                          placeholder="One product price..."
                        />,
                      )}
                    </Form.Item>
                  </Form>


                </Modal>
              </div>
          </Tabs.TabPane>
          <Tabs.TabPane tab="Archive" key="2">
            <Col span={20} offset={2}>
              <Table dataSource={archiveData} columns={visibleColumns}/>
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
