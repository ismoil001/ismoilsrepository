import {notification} from "antd";
import {searchUser, doAksverka} from "../payment/service";

export default {
  namespace: 'aksverka',
  state: {
    searchValue: '',
    userList: [],
    aksverkaList: [],
    saldo: 0,
    sumPayment: 0,
    sumOrderCost: 0,
    sumCount: 0,
  },

  subscriptions: {


    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/aksverka') {

        }
      });
    },
  },

  effects: {

    * do({payload}, {call, put, select}) {
      const data = yield call(doAksverka, {id: payload})
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            aksverkaList: data.object.aksverkaList,
            saldo: data.object.saldo,
            sumPayment: data.object.sumPayment,
            sumOrderCost: data.object.sumCost,
            sumCount: data.object.sumCount
          }
        })
      }
    },

    * searchUser({payload}, {call, put, select}) {
      const data = yield call(searchUser, {name: payload})
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            userList: data.object
          }
        })
      }
    },

  },


  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },

  }
}
