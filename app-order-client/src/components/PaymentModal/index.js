import React, {Component} from 'react';
import {Modal, Form, InputNumber} from "antd";

class Index extends Component {
  render() {
  const {modalVisible, onHideModal,onSave,form} =this.props;
  const {getFieldsValue,getFieldDecorator} =form;

  const onSubmit=()=>{
    onSave(getFieldsValue())
  }

    return (
      <Modal onOk={onSubmit} onCancel={onHideModal} visible={modalVisible}>
        <Form>
          <Form.Item>
            {getFieldDecorator('amount', {
              rules: [{required: true, message: 'Please input amount!'}],
            })(
             <InputNumber placeholder={"Amount"}/>,
            )}
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}


export default Form.create()(Index);
