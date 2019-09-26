import React from 'react'
import PropTypes from 'prop-types'
import MaskedInput from 'react-text-mask'
import { connect } from 'dva'
import {Button, Row, Form, Input, Col, Icon} from 'antd'
import { config } from 'utils'
import styles from './index.less'
// import {FormattedMessage, formatMessage} from 'umi/locale'

const FormItem = Form.Item;

const Login = ({
  loading,
  dispatch,
  form: {
    getFieldDecorator,
    validateFieldsAndScroll,
  },
}) => {
  function handleOk () {
    validateFieldsAndScroll((errors, values) => {
      if (errors) {
        return
      }
      dispatch({ type: 'login/login', payload: values })
    })
  }

  return (

    <div id="login">
      <form>
        <Row>
          <Col span='24'>
            <img src="/assets/images/logo.png" className='pl-3 mt-4' alt="wrk"/>
          </Col>
        </Row>
        <Row className='mt-5 pt-4'>
          <Col span={8} className=' offset-2 text-center mt-5' >
            <Row>
                <h4 className=' text-center mb-5 ml-5 pl-4' >Tizimga kirish</h4>
              <div className="row pl-5 mb-3 text-left">
                <div className="col-md-1 p-0 userr">
                  <span id="nma"><Icon type="user" /></span>
                </div>
                <div className="col-md-10 userrr pl-0">
                  <FormItem hasFeedback>
                    {getFieldDecorator('username', {
                      rules: [
                        {
                          required: true,
                        },
                      ],
                    })(<MaskedInput
                      id="user"
                      autocomplete="off"
                      addonBefore={<Icon type="user" />}
                      onPressEnter={handleOk}
                      placeholder={"+998"}
                      mask={["+", "9", "9", "8", /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                      maskChar={null}
                    />)}
                  </FormItem>
              </div>

              </div>


                <FormItem hasFeedback>
                  {getFieldDecorator('password', {
                    rules: [
                      {
                        required: true,
                      },
                    ],
                  })(<Input
                    className="mt-2 mb-2"
                    addonBefore={<Icon type="lock" />}
                    type="password" onPressEnter={handleOk}
                    placeholder={"Password"}
                  />)}
                </FormItem>
                <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
                  Sign in
                </Button>
            </Row>
          </Col>
          <Col span='10' className="ml-5 pl-5">
            <img src="assets/images/loginimg.png"  className='img-fluid' alt="pie"/>
          </Col>
        </Row>
      </form>
    </div>




  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
