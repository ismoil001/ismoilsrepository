import {Modal, Button, Col, Checkbox, Row, Form, Input, Table, Popconfirm} from 'antd';
import React from "react";
import ant from 'antd';
import {connect} from "react-redux";
const {Upload, Icon, message}=ant;

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

@connect(({master}) => ({master}))
class Index extends React.Component {
  componentWillMount() {
    const {dispatch}=this.props;
    dispatch({
      type:'master/allMasters'
    })
  }

  state = {visible: false};

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
    this.props.dispatch({
      type:'master/updateState',
      payload:{
        isEdit:false,
        attachment:this.props.master.photoUrl,
        currentMaster:'',
        photoUrl: ''
      }
    })

  };
  state = {
    loading: false,
  };

  handleChange = info => {
    console.log(info)
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
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
    const {dispatch, master} = this.props;
    const {photoUrl,currentMaster,masters,isEdit} = master;
    const {getFieldDecorator,resetFields, validateFields,getFieldsValue, getFieldsError, getFieldError, isFieldTouched} = this.props.form;
    const uploadButton = (
      <div style={{border:"1px solid #eee",padding:"20px",zIndex:10}}>
        <Icon type={this.state.loading ? 'loading' : 'plus'}/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    const showModal = () => {
      resetFields();
      dispatch({
        type:'master/updateState',
        payload:{
          isEdit:false,
          attachment:this.props.master.photoUrl,
          currentMaster:'',
          photoUrl: ''
        }
      })
      this.setState({
        visible: true,
      });
    };

    const columns = [
      {
        title: 'TR',
        dataIndex: 'TR',
        key: 'TR',
        render:(text,record)=><span>
          {masters.indexOf(record)+1}
        </span>
      },
      {
        title: 'Rasm',
        dataIndex: 's',
        key: 'Rasm',
        render: (text, record) => <span>
     <div style={{width: "50px", height: "50px", borderRadius: "5px"}}>
       <img className="img-fluid" src={"http://localhost:/api/file/get/" + record.attachment.id} alt=""/>
     </div>

    </span>
      },
      {
        title: 'Ismi',
        dataIndex: 'fullName',
        key: 'UZ',
      },
      {
        title: 'Izoh',
        dataIndex: 'description',
        key: 'RU',
      },
      {
        title: 'Amallar',
        dataIndex: 'action',
        key: 'action',
        render: (text, record) => <span>
          <Popconfirm placement="topLeft" title="Tasdiqlash" onConfirm={()=>delMaster(record.id)} okText="Yes"
                      cancelText="No">
            <div className="d-inline-block circle delete-circle ml-4"> <Icon
              type="delete"/></div>
          </Popconfirm>
     {/*<div onClick={()=>delMaster(record.id)} className="d-inline-block circle delete-circle"> <Icon*/}
     {/*  type="delete"/></div>*/}
     <div onClick={()=>editMaster(record)} className="d-inline-block circle ml-4"><Icon type="edit"/> </div>
    </span>
      },

    ];
    const editMaster=(record)=>{
      dispatch({
        type:'master/updateState',
        payload:{
          currentMaster:record,
          isEdit:true,
          photoUrl:record.attachment.id
        }
      });
      this.setState({
        visible: true,
      });
    }
    const delMaster=(id)=>{
      dispatch({
        type:'master/deleteMaster',
        payload:{
          id
        }
      })
    };
    const uploadFile = (options) => {
      dispatch({
        type: 'master/saveMasterPhoto',
        payload: {
          options
        }

      })
    };
    const handleOkok = () => {
      validateFields((error,values)=>{
        if(!error){
          console.log(getFieldsValue());
          let obj = getFieldsValue();
          this.setState({
            visible: false,
          });
          dispatch({
            type: 'master/createMaster',
            payload: {
              name: obj.name,
              description:obj.description,
              attachment:photoUrl,
              active:true
            }
          })
        }
      });
    };
    const updateMaster=()=>{
      let obj = getFieldsValue();
      this.setState({
        visible: false,
      });
      dispatch({
        type: 'master/edMaster',
        payload: {
          id:currentMaster.id,
          name: obj.name,
          description:obj.description,
          attachment:photoUrl,
          active:true
        }
      });
    };
    return (
      <div>
        <Row>
          <h2 className="text-center mb-4 mt-5"><b>Masterlar ro'yhati</b></h2>
          <Col offset={2} span={5} className="mr-4">
            <div onClick={showModal} className="btn btn-dark my-3 mb-2">Master qo'shish</div>
          </Col>
          <Col span={20} offset={2}>
            <Table columns={columns} dataSource={masters} pagination={false}/>
          </Col>
        </Row><br/><br/>
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={isEdit?updateMaster:handleOkok}
          onCancel={this.handleCancel}
        >
          <Col span={8}>
            <Upload
              name="avatar"
              // className="avatar-uploader"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={uploadFile}
            >
              {photoUrl ? <img src={"http://localhost:/api/file/get/" + photoUrl} alt="avatar"
                               style={{width: '100%'}}/> :
                 uploadButton}
            </Upload>
          </Col>
          <Col span={14}>
            <Form>
              <Form.Item>
                {getFieldDecorator('name', {
                  initialValue:currentMaster?currentMaster.fullName:"",
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
                  initialValue:currentMaster?currentMaster.description:"",
                  rules: [{required: true, message: 'Iltimos, manager familiyasini kiriting!'}],
                })(
                  <Input
                    type="text"
                    placeholder="Lavozimi"
                  />,
                )}
              </Form.Item>
            </Form>

          </Col>

        </Modal>
      </div>
    );
  }
}

export default Form.create()(Index);
