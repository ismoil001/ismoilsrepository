import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import MaskedInput from 'react-text-mask'
import ant from "antd";
import {Container} from "reactstrap";
const {Button, Col, Form, Icon, Input, Modal, Row, Table}=ant;
import {Container, Nav, NavItem, NavLink, TabContent, TabPane} from "reactstrap";
import classnames from 'classnames';

@connect(({manager}) => ({manager}))
class Index extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/getManager'
    });
    dispatch({
      type: 'manager/getCustomers'
    })
  }
  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: '1'
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }
  render() {
    const {dispatch, manager} = this.props;
    const {
      allManagers, record, isEdit,allCustomers,
      recordId, openDeleteModal, openAddModal
    } = manager;
    console.log(allCustomers)
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const columns = [
      {
        title: 'TR',
        dataIndex: 'TR',
        key: 'TR',
        render: (text, record) => <span>
          {allManagers.indexOf(record) + 1}
        </span>
      },
      {
        title: 'FIO',
        dataIndex: 'FIO',
        key: 'firstName',
        render: (text, record) => <span><b>
          {record.lastName + "  " + record.firstName + "  " + record.patron}</b>
        </span>
      },
      {
        title: 'Tel. raqami',
        dataIndex: 'phoneNumber',
        key: 'RU',
      },
      {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <span>
     <div onClick={() => deleteManager(record.id)} className="d-inline-block circle delete-circle ml-4"> <Icon
       type="delete"/></div>
     <div onClick={() => updateManager(record)} className="d-inline-block circle ml-4"><Icon type="edit"/> </div>
    </span>
      },

    ];
    const deleteManager = (id) => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          recordId: id,
          openDeleteModal: !openDeleteModal
        }
      })
    };
    const updateManager = (record) => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          record,
          openAddModal: !openAddModal,
          isEdit: !isEdit,
        }
      })
    };
    const addManager = () => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          openAddModal: !openAddModal,
          isEdit: false
        }
      })
    };
    const savingManager = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (isEdit) {
            dispatch({
              type: 'manager/editingManager',
              payload: {
                id: record.id,
                data: values
              }
            });
          } else {
            dispatch({
              type: 'manager/saveManager',
              payload: values
            });
          }
        }
      });

    };
    const closeAddModal = () => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          openAddModal: !openAddModal,
          record: {},
          recordId: ''
        }
      })
    };
    const closeDelModal = () => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          openDeleteModal: !openDeleteModal,
          record: {},
          recordId: ''
        }
      })
    };
    const deletingManager = () => {
      dispatch({
        type: 'manager/delManager',
        payload: {
          path: recordId
        }
      })
    }
    return (
      <div>
        <Container>
          <Row className="mt-3">
            <Col span={24}>
              <Nav tabs className="mt-4">
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '1'})}
                    onClick={() => {
                      this.toggle('1');
                    }}
                  >
                    <h6> Barcha Manager lar ro'yxati</h6>
                  </NavLink>
                </NavItem>
                <NavItem>
                  <NavLink
                    className={classnames({active: this.state.activeTab === '2'})}
                    onClick={() => {
                      this.toggle('2');
                    }}
                  >
                    <h6>Barcha Xaridorlar ro'yxati</h6>
                  </NavLink>
                </NavItem>
              </Nav>
              <TabContent activeTab={this.state.activeTab}>
                <TabPane tabId="1">
                  <h2 className="text-center mt-2 mb-1"><b>Managerlar</b></h2>
                      <Button  onClick={addManager} className=" btn-dark mb-2">Qo'shish</Button>
                  <Table pagination={false} columns={columns} dataSource={allManagers}/>
                </TabPane>
                <TabPane tabId="2">
                  <h2 className="text-center mt-2 mb-2"><b>Haridorlar</b></h2>
                  <Table pagination={false} columns={columns} dataSource={allCustomers}/>
                </TabPane>
              </TabContent>
              {/*<Table pagination={false} columns={columns} dataSource={allManagers}/>*/}
            </Col>
          </Row>
        </Container>
        <Modal
          title="Modal"
          visible={openAddModal}
          onCancel={closeAddModal}
          onOk={savingManager}
        >
          <Form>
            <Form.Item>
              {getFieldDecorator('firstName', {
                initialValue: record && record.firstName,
                rules: [{required: true, message: 'Iltimos, manager ismini kiriting!'}],
              })(
                <Input
                  type="text"
                  placeholder="Ismini kiritng:"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('lastName', {
                initialValue: record&& record.lastName,
                rules: [{required: true, message: 'Iltimos, manager familiyasini kiriting!'}],
              })(
                <Input
                  type="text"
                  placeholder="Familiyasini kiriting"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('patron', {
                initialValue:record&& record.patron,
                rules: [{required: true, message: 'Iltimos, manager otasining ismini kiriting!'}],
              })(
                <Input
                  type="text"
                  placeholder="Otasining ismini kiritng:"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('phoneNumber', {
                initialValue: record.phoneNumber,
                rules: [{required: true, message: 'Iltimos, manager telefon raqamini kiriting!'}],
              })(
                <MaskedInput
                  className="form-control"
                  placeholder="+ 998"
                  mask={["+", "9", "9", "8", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                  maskChar={null}
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('password', {
                rules: [{required: true, message: 'Iltimos, manager uchun parol kiriting!'}],
              })(
                <Input
                  type="password"
                  placeholder="parol kiriting"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
        <Modal
          title="Modal"
          visible={openDeleteModal}
          onCancel={closeDelModal}
          onOk={deletingManager}
        >
          <h4>Managerni o'chirmoqchimisiz?</h4>
        </Modal>
      </div>
    );
  }
}

Index.propTypes = {};
Index = Form.create({})(Index);

export default Index;
