import {routerRedux} from 'dva/router'
import {login} from './service'
import {notification} from "antd";
import {config} from 'utils'
import {query, logout} from 'services/app'
import {TOKEN_NAME} from '@/constants';
import router from "umi/router";


export default {

  namespace: 'login',

  state: {},
  effects: {
    * login({
              payload,
            }, {put, call, select}) {

      const data = yield call(login, payload);
      const {locationQuery} = yield select(_ => _.app);
      if (typeof data !== 'undefined') {
        localStorage.setItem(TOKEN_NAME, JSON.stringify(data));
        const {from} = locationQuery;
        yield put({type: 'app/query'});
        if (from && from !== '/login') {
          yield put(routerRedux.push(from))
        } else {
          yield put(routerRedux.push('/dashboard'))
        }
      } else {
        notification.error({
          message: config.messageHeader,
          description: "Error login",
        });
      }
    },
  },

}
