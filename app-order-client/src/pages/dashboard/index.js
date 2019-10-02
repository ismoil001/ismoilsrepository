import React, {PureComponent} from 'react';
import {connect} from "dva"
import moment from 'moment'
import PaymentModal from '../../components/PaymentModal/index'
import CurrencyInput from 'react-currency-input';
import {
  Button,
  Checkbox,
  Col,
  DatePicker,
  Dropdown,
  Form,
  Icon,
  Input,
  Menu,
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
    const {modalVisible,status, modalType,modalLoading, currentItem, customerList, currentItemPaymentSum, ismine, archiveData, orderLists, page, totalElements, searchValue, paymentModalVisible} = dashboard;
    const {getFieldDecorator,validateFields,getFieldsValue, resetFields,setFieldsValue} = form;
    // const {modalVisible, status, modalType, modalLoading, currentItem, customerList, currentItemPaymentSum, ismine, archiveData, orderLists, page, totalElements, searchValue, paymentModalVisible} = dashboard;
    // const {getFieldDecorator, getFieldsValue, resetFields, setFieldsValue} = form;
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
      validateFields((err, values) => {
        if (!err) {
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
      });

    }

    const visibleColumns = [
      {
        title: 'Sana',
        dataIndex: 'date',
        key: 'date'
      },
      {
        title: 'Mahsulot',
        dataIndex: 'productName',
        key: 'productName'
      },
      {
        title: 'Kompaniya',
        dataIndex: 'companyName',
        key: 'company',
      },
      {
        title: 'Mijoz',
        dataIndex: 'userFullName',
        key: 'user',
      },
      {
        title: 'Manager',
        dataIndex: 'managerFullName',
        key: 'manager',
      },
      {
        title: 'Hisob',
        dataIndex: 'count',
        key: 'count',
        render: (text, record) => record.count.toLocaleString()
      },
      {
        title: 'Narx',
        dataIndex: 'price',
        key: 'price',
        render: (text, record) => record.price.toLocaleString()

      },
      {
        title: 'Sum',
        dataIndex: 'sum',
        key: 'sum',
        render: (text, record) => record.sum.toLocaleString()
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
        title: 'To`lov',
        dataIndex: 'payments',
        key: 'payment',
        render: (text, record) => record.payments.map(item => {
          return <div><span><b>{item.amount} sum</b>&nbsp; {item.date}</span><br/>
          </div>
        })
      },
      {
        title: 'Amallar',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record) =>
          <div>
            <Dropdown overlay={<Menu>
              <Menu.Item className="p-0 my-1 mx-2">
                <Button className="border-0 text-center w-100" onClick={() => onClickMenu(1, record)}>O`zgartirish</Button>
              </Menu.Item>
              <Menu.Item className="p-0 my-1 mx-2">
                <Popconfirm placement="topLeft" title="Tasdiqlash" onConfirm={() => onClickMenu(2, record)} okText="Yes"
                            cancelText="No">
                  <Button className="border-0 text-center w-100">O`chirish</Button>
                </Popconfirm>
              </Menu.Item>
              {record.status === "ACTIVE" ? <Menu.Item className="p-0 my-1 mx-2">
                  <Button className="border-0 text-center w-100" onClick={() => onClickMenu(3, record)}>Bajarildi</Button>
                </Menu.Item> :
                <Menu.Item className="p-0 my-1 mx-2">
                  <Button className="border-0 text-center w-100" onClick={() => onClickMenu(4, record)}>Faol</Button>
                </Menu.Item>
              }
            </Menu>}>
              <a className="ant-dropdown-link">
                <Icon type="dash"/> <Icon type="down"/>
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
      if (key === 4) {
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
          ismine: ismine,
          status: status
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
          status: status,
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
          type: 'dashboard/updateState',
          payload: {
            status: "notactive"
          }
        })
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
          type: 'dashboard/updateState',
          payload: {
            status: "active"
          }
        })
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

    const onSearchCompany = (val) => {
      if (val === '') {
        dispatch({
          type: 'dashboard/updateState',
          payload: {
            customerList: []
          }
        })
      } else {
        dispatch({
          type: 'dashboard/searchUser',
          payload: val
        })
      }
    }

    return (
      <div className="container-fluid bg-white">
        <div className="container admin">
          <h2 className="text-center pt-5 py-3"><b>Buyurtmalar</b></h2>
          <Row>
            <Col offset={17} className=''>
              <div className="d-flex align-items-center justify-content-end">
                <span className='ml-5 mr-3'>Mening buyurtmalarim</span>
                <Checkbox onChange={handleIsMine} checked={ismine}></Checkbox>
              </div>
            </Col>
            <Col span={24} className="">
              <div className="d-flex align-items-center justify-content-between">
                <div className="">
                  <button onClick={handleOpenModal} className="btn btn-dark ">Buyurtma qo'shish</button>
                </div>
                <div className="">
                  <ul className='list-unstyled mt-3 mb-0 mr-0 ml-0'>
                    <li className='d-inline-block'>
                      <Input className="" onChange={handleSearch}/>
                    </li>
                    <li className='d-inline-block'>
                      <Button className="btn-dark" onClick={searchButton}>Qidiruv</Button>
                    </li>
                  </ul>
                </div>
              </div>
            </Col>
          </Row>
          <Tabs onChange={handleTab} className="pb-5 pt-1">
            <Tabs.TabPane tab="Barcha buyurtmalar" key="1">

              <Row className="my-4">
                <Col span={24}>
                  <Table dataSource={orderLists} columns={visibleColumns} pagination={false}/>
                  <Pagination
                    current={page}
                    onChange={onChangePage} pageSize={10} total={totalElements}/>
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
                      initialValue: currentItem? currentItem.userId:'Mijoni tanlang...',
                      rules: [{required: true, message: 'Please select company!'}],
                    })(
                      <Select placeholder="User" onSearch={onSearchCompany} showSearch optionFilterProp="children">
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
                  <Form.Item label={"Soni"}>
                    {getFieldDecorator('count', {
                      initialValue: currentItem && currentItem.count,
                      rules: [{required: true, message: 'Please input your product count!'}],
                    })(
                      <CurrencyInput className="form-control" precision={''} thousandSeparator=" "/>
                      // <CurrencyInput className="form-control" placeholder="Soni..." precision={''}
                      //                thousandSeparator=" "/>
                    )}
                  </Form.Item>
                  <Form.Item label={"Narxi"}>
                    {getFieldDecorator('price', {
                      initialValue: currentItem && currentItem.price,
                      rules: [{required: true, message: 'Please input one product price!'}],
                    })(
                      <CurrencyInput className="form-control" placeholder="Narx..." precision={''} thousandSeparator=" "/>
                    )}
                  </Form.Item>
                </Form>
              </Modal>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Arxiv" key="2">
              <Col span={24}>

                <Table dataSource={orderLists} columns={visibleColumns} pagination={false}/>
                <Pagination style={{position: "relative"}}
                            current={page}
                            onChange={onChangePage} pageSize={10} total={totalElements} pagination={false}/>

              </Col>

            </Tabs.TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

Index.propTypes = {};

export default Form.create()(Index);
