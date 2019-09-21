import {saveOrder,getCustomers,getActiveOrders,editOrder,deleteOrder,saveOrderPayment} from './service'
import {notification} from "antd";
export default {
  namespace: 'dashboard',
  state: {
    modalVisible: false,
    modalType: 'create',
    currentItem: '',
    customerList:[],
    orderLists:[],
    searchValue:'',
    paymentModalVisible:false,
    page:0,
    totalElements:0,
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
            payload:{
              page:0,
              size:10,
              name:''
            }
          })
        }
      });
    },
  },

  effects: {
    *saveOrderPayment({payload},{call,put,select}){
      const data = yield call(saveOrderPayment,payload)
    },

    *deleteOrder({payload},{call,put,select}){
      const data = yield call(deleteOrder,{id:payload})
      if(data.success){
        notification['success']({
          message:'deleted'
        })
        yield put({
          type:'getOrders',
          payload:{
            page:0,
            size:10,
            name:''
          }
        })
      }
    },
    * saveOrder({payload}, {call, put, select}) {
      payload.orderedDate = new Date(payload.orderedDate).getTime()
      const data = yield call(saveOrder,payload);
      if(data.success){
        notification['success']({
          message:'Saved'
        })
        yield put({
          type:'getOrders',
          payload:{
            page:0,
            size:10,
            name:''
          }
        })
        yield put({
          type:'updateState',
          payload:{
            modalVisible:false,
          }
        })
      }

    },
    * editOrder({payload}, {call, put, select}) {
      payload.orderedDate = new Date(payload.orderedDate).getTime()
      const data = yield call(editOrder,payload);
      if(data.success){
        notification['success']({
          message:'Saved'
        })
        yield put({
          type:'getOrders',
          payload:{
            page:0,
            size:10,
            name:''
          }
        })
        yield put({
          type:'updateState',
          payload:{
            modalVisible:false,
            currentItem: '',
            modalType:'create'
          }
        })
      }

    },

    * getCustomers({payload}, {call, put, select}) {
      const data = yield call(getCustomers);
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            customerList:data.object,
          }
        })
      }
    },

    *getOrders({payload},{call,put,select}){
      const data  =yield call(getActiveOrders,payload)
      console.log(data)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            orderLists:data.object.object,
            totalElements:data.object.totalElements,
            page:data.object.currentPage,
          }
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
