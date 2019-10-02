import React, {Component} from 'react';
import {connect} from "dva";
import {Upload, Col, Row, Icon, Modal, notification, Button, Card} from 'antd';
function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}
@connect(({settings})=>({settings}))
class Portfolio extends Component {


  state = {
    previewVisible: false,
    previewImage: '',
    fileList: [

    ],
  };

  handleCancel = () => this.setState({ previewVisible: false });

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });
  };

  handleChange = ({ fileList }) => this.setState({ fileList });




  render() {
    const {settings,dispatch} =this.props;
    const {loadingImage,oldAttachment,photo,portfolioList} =settings;

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <Card className="text-center portfolio-card">
        <Icon className="mt-5"  type={loadingImage ? 'loading' : 'plus'} />
        <div className="mt-2 ant-upload-text">Yuklash</div>
      </Card>
    );
    function beforeUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isPNG = file.type === "image/png";
      if (!isJPG && !isPNG) {
        notification['error']({message:"You can only upload JPG or PNG file!"});
      }

      return isJPG || isPNG;
    }

    const customRequest=(options)=>{
      dispatch({
        type:'settings/uploadFile',
        payload:{
          options
        }
      })
    }
    const handleSave=()=>{
      alert(photo.split("/")[3])
      dispatch({
        type:'settings/savePortfolio',
        payload:{
          attachment:photo && photo.split("/")[3]
        }
      })
    }
    const deletePortfolio=(id)=>{
      console.log(id)
      dispatch({
        type:'settings/deletePortfolio',
        payload:{
          id
        }
      })
    }

    return (
      <div className="clearfix">
        <h2 className="text-center mt-5 mb-5"><b>Portfolio qo'shish</b></h2>
        <Col span={20} offset={2}>
          <Col span={4} style={{marginRight: '36px'}}>
            <Upload
              name="attachment"
              showUploadList={false}
              beforeUpload={beforeUpload}
              customRequest={customRequest}
            >
              {uploadButton}
            </Upload>


            {/*<Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>*/}
              {/*<img alt="example" style={{ width: '100%' }} src={previewImage} />*/}
            {/*</Modal>*/}
          </Col>
            {portfolioList && portfolioList.map(item=>
              <Col span={4} className="position-relative portfolio-card mb-5">
                <Icon onClick={()=>deletePortfolio(item.id)} className="delete-portfolio position-absolute" type="close-circle" />
                <img className="img-fluid h-100" src={item.attachment &&'/api/file/get/'+item.attachment.id} alt="avatar"/>
              </Col> )}
        </Col>
      </div>
    );
  }
}


export default Portfolio;
