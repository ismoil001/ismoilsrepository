import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import {Button, Row, Form, Input, Icon} from 'antd'
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
    <div>
      <div className={styles.left}>
        <div className={styles.logo}>
          <span>{config.name}</span>
        </div>
      </div>
      <div className={styles.form}>
        <form>
          <h1 className={styles.title}>Phone number</h1>
          <FormItem hasFeedback>
            {getFieldDecorator('username', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input autocomplete="off" addonBefore={<Icon type="user" />} className={styles.oms_input} onPressEnter={handleOk} placeholder={"Phone number"} />)}
          </FormItem>
          <FormItem hasFeedback>
            {getFieldDecorator('password', {
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input  addonBefore={<Icon type="lock" />} className={styles.oms_input} type="password" onPressEnter={handleOk} placeholder={"Password"} />)}
          </FormItem>
          <Row>
            <Button type="primary" onClick={handleOk} loading={loading.effects.login}>
              Sign in
            </Button>
          </Row>

        </form>
      </div>
    </div>

  )
}

Login.propTypes = {
  form: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default connect(({ loading }) => ({ loading }))(Form.create()(Login))
