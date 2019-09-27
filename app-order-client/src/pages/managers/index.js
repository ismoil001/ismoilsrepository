import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {connect} from "react-redux";
import {Button, Col, Form, Icon, Input, Modal, Row, Table} from "antd";
import {Container} from "reactstrap";

@connect(({manager}) => ({manager}))
class Index extends Component {
  componentWillMount() {
    const {dispatch} = this.props;
    dispatch({
      type: 'manager/getManager'
    })
  }

  render() {
    const {dispatch, manager} = this.props;
    const {allManagers, record, isEdit,
      recordId, openDeleteModal, openAddModal} = manager;
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
          isEdit:!isEdit,
        }
      })
    };
    const addManager = () => {
      dispatch({
        type:'manager/updateState',
        payload:{
          openAddModal:!openAddModal,
          isEdit:false
        }
      })
    };
    const savingManager = (e) => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          if (isEdit){
            dispatch({
              type: 'manager/editingManager',
              payload: {
                id:record.id,
                data:values
              }
            });
          }else {
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
          record:{},
          recordId:''
        }
      })
    };
    const closeDelModal = () => {
      dispatch({
        type: 'manager/updateState',
        payload: {
          openDeleteModal: !openDeleteModal,
          record:{},
          recordId:''
        }
      })
    };
    const deletingManager=()=>{
      dispatch({
        type:'manager/delManager',
        payload:{
          path:recordId
        }
      })
    }
    return (
      <div>
        <Container>
          <Row className="mt-3">
            <Col span={24}>
              <Button type="primary" onClick={addManager} className="float-right">Qo'shish</Button>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col span={24}>
              <Table pagination={false} columns={columns} dataSource={allManagers}/>
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
                initialValue: record.firstName,
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
                initialValue: record.lastName,
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
                initialValue: record.patron,
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
                <Input
                  type="text"
                  placeholder="Telefon raqamini kiriting"
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
