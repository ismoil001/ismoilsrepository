import React, {Component} from 'react';
import {Modal, Form, InputNumber} from "antd";

class Index extends Component {
  render() {
  const {modalVisible, onHideModal,onSave,form, item,itemPaySum} =this.props;
  const {getFieldsValue,getFieldDecorator,resetFields} =form;
  const onSubmit=()=>{
    onSave(getFieldsValue())
    resetFields();
  }

    return (
      <Modal onOk={onSubmit} onCancel={onHideModal} visible={modalVisible}>
        <Form>
          <Form.Item>
            {getFieldDecorator('amount', {
              initialValue:item.sum-itemPaySum,
              rules: [{required: true, message: 'Please input amount!'}],
            })(
             <InputNumber placeholder={"Amount"} min={0} max={item.sum-itemPaySum}/>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default Form.create()(Index);
