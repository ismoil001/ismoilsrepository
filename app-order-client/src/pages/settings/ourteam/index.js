import {Modal, Button, Col, Checkbox, Row, Form, Input, Table} from 'antd';
import React from "react";
import { Upload, Icon, message } from 'antd';




function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJpgOrPng && isLt2M;
}


class Index extends React.Component {
  state = { visible: false };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };
  state = {
    loading: false,
  };

  handleChange = info => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true });
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl =>
        this.setState({
          imageUrl,
          loading: false,
        }),
      );
    }
  };

  render() {
    const {getFieldDecorator, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    const { imageUrl } = this.state;

    const visibleColumns = [
      {
        title: 'Rasm',
        dataIndex:'photo',
        key:'date'
      },{
        title:'Ism Familia',
        dataIndex:'masterName',
        key:'masterName'
      },
      {
        title:'Tavsifi',
        dataIndex:'masterDescription',
        key:'masterDescription'
      }
    ]
    return (
      <div>
        <Row>
          <h2 className="text-center mb-4 mt-5"><b>Usta qo'shish</b></h2>
          <Col offset={2} span={5} className="mr-4">
            <div onClick={this.showModal} className="btn btn-dark my-3 mb-2">Add payment</div>
          </Col>
          <Col span={20} offset={2}>
            <Table columns={visibleColumns} pagination={false}/>
          </Col>
        </Row>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Col span={8}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={this.handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: '100%' }} /> : uploadButton}
            </Upload>
          </Col>
          <Col span={14}>
            <Form.Item>
              {getFieldDecorator('name', {
                rules: [{required: true, message: 'Iltimos, manager familiyasini kiriting!'}],
              })(
                <Input
                  type="text"
                  placeholder="To'liq ismi"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('description', {
                rules: [{required: true, message: 'Iltimos, manager familiyasini kiriting!'}],
              })(
                <Input
                  type="text"
                  placeholder="Lavozimi"
                />,
              )}
            </Form.Item>
          </Col>

        </Modal>
      </div>
    );
  }
}

export default Form.create()(Index);
