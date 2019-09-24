import {saveOrder,getCustomers,changeStatusOrder,getActiveOrders,editOrder,deleteOrder,saveOrderPayment} from './service'
import {notification} from "antd";
import {searchUser} from "../payment/service";
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
    ismine:false,
    archiveData:[],
    currentItemPaymentSum:[],
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
              name:'',
              ismine:false,
              status:'active'
            }
          })
        }
      });
    },
  },

  effects: {
    *saveOrderPayment({payload},{call,put,select}){
      const {ismine} = yield select(_=>_.dashboard)

      const data = yield call(saveOrderPayment,payload)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            paymentModalVisible: false
          }
        })
        notification['success']({
          message:'added'
        })
        yield put({
          type:'getOrders',
          payload:{
            page:0,
            size:10,
            name:'',
            ismine:ismine,
            status:'active'
          }
        })
      }
    },

    *deleteOrder({payload},{call,put,select}){
      const {ismine} = yield select(_=>_.dashboard)

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
            name:'',
            ismine:ismine,
            status:'active'
          }
        })
      }
    },
    * saveOrder({payload}, {call, put, select}) {
      const {ismine} = yield select(_=>_.dashboard)

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
            name:'',
            ismine:ismine,
            status:'active'
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
      const {ismine} = yield select(_=>_.dashboard)
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
            name:'',
            ismine:ismine,
            status:'active'
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
            page:data.object.currentPage+1,
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
    *setStatusOfOrder({payload},{call,put,select}){
      const {ismine} = yield select(_=>_.dashboard)

      const data = yield call(changeStatusOrder,payload)
      if(data.success){
        yield put({
          type:'getOrders',
          payload:{
            page:0,
            size:10,
            name:'',
            ismine:ismine,
            status:'active'
          }
        })
        notification['success']({
          message:'archived'
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
