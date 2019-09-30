import {
  saveOrder,
  getCustomers,
  changeStatusOrder,
  changeStatusOrder1,
  getActiveOrders,
  editOrder,
  deleteOrder,
  saveOrderPayment
} from './service'
import {notification} from "antd";
import {searchUser} from "../payment/service";

export default {
  namespace: 'dashboard',
  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: '',
    customerList: [],
    orderLists: [],
    searchValue: '',
    paymentModalVisible: false,
    page: 0,
    totalElements: 0,
    ismine: false,
    status:'active',
    modalLoading:false,
    archiveData: [],
    currentItemPaymentSum: [],
  },

  subscriptions: {


    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/dashboard') {
          dispatch({
            type: 'getCustomers'
          })
          dispatch({
            type: 'getOrders',
            payload: {
              page: 0,
              size: 10,
              name: '',
              ismine: false,
              status: 'active'
            }
          })
        }
      });
    },
  },

  effects: {
    * saveOrderPayment({payload}, {call, put, select}) {
      const {ismine} = yield select(_ => _.dashboard)

      const data = yield call(saveOrderPayment, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            paymentModalVisible: false
          }
        })
        notification['success']({
          message: 'added'
        })
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'active'
          }
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          modalLoading: false
        }
      })
    },

    * deleteOrder({payload}, {call, put, select}) {
      const {ismine} = yield select(_ => _.dashboard)

      const data = yield call(deleteOrder, {id: payload})
      if (data.success) {
        notification['success']({
          message: 'deleted'
        })
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'active'
          }
        })
      }
    },
    * saveOrder({payload}, {call, put, select}) {
      const {ismine} = yield select(_ => _.dashboard)
      payload.price = payload && parseFloat(payload.price.replace(/\s/g, ''))
      payload.count = payload && parseFloat(payload.count.replace(/\s/g, ''))
      payload.orderedDate = new Date(payload.orderedDate).getTime()
      const data = yield call(saveOrder, payload);
      if (data.success) {
        notification['success']({
          message: 'Saved'
        })
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'active'
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
          }
        })
      }

      yield put({
        type: 'updateState',
        payload: {
          modalLoading: false
        }
      })

    },
    * editOrder({payload}, {call, put, select}) {
      if(typeof payload.price!=="number"){
        payload.price = payload && parseFloat(payload.price.replace(/\s/g, ''))
        payload.count = payload && parseFloat(payload.count.replace(/\s/g, ''))
      }
      const {ismine} = yield select(_ => _.dashboard)
      payload.orderedDate = new Date(payload.orderedDate).getTime()
      const data = yield call(editOrder, payload);
      if (data.success) {
        notification['success']({
          message: 'Saved'
        })
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'active'
          }
        })
        yield put({
          type: 'updateState',
          payload: {
            modalVisible: false,
            currentItem: '',
            modalType: 'create'
          }
        })
      }

      yield put({
        type: 'updateState',
        payload: {
          modalLoading: false
        }
      })

    },

    * getCustomers({payload}, {call, put, select}) {
      const data = yield call(getCustomers);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            customerList: data.object,
          }
        })
      }
    },

    * getOrders({payload}, {call, put, select}) {

      const data = yield call(getActiveOrders, payload)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            orderLists: data.object.object,
            totalElements: data.object.totalElements,
            page: data.object.currentPage + 1,
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
            customerList: data.object
          }
        })
      }
    },
    * setStatusOfOrder({payload}, {call, put, select}) {
      const {ismine} = yield select(_ => _.dashboard)

      const data = yield call(changeStatusOrder, payload)
      if (data.success) {
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'active'
          }
        })
        notification['success']({
          message: 'archived'
        })
      }
    },
    * setStatusOfOrder1({payload}, {call, put, select}) {
      const {ismine} = yield select(_ => _.dashboard)

      const data = yield call(changeStatusOrder1, payload)
      if (data.success) {
        yield put({
          type: 'getOrders',
          payload: {
            page: 0,
            size: 10,
            name: '',
            ismine: ismine,
            status: 'notactive'
          }
        })
        notification['success']({
          message: 'actoved'
        })
      }
    }

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
