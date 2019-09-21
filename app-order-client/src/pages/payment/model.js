import {notification} from "antd";
import {searchUser,getPayTypes,getPayments,savePayment,deletePayment} from './service'
export default {
  namespace: 'payment',
  state: {
    modalVisible:false,
    modalType:'create',
    currentItem:'',
    userList:[],
    selectedUser:'',
    payTypes:[],
    paymentList:[],
  },

  subscriptions: {


    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/payment') {
          dispatch({
            type:'queryPayType'
          })
          dispatch({
            type:'queryPayment'
          })
        }
      });
    },
  },

  effects: {

    *queryPayment({payload},{call,put,select}){

      const data = yield call(getPayments);
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            paymentList:data.object
          }
        })
      }

    },

    *deletePayment({payload},{call,put,select}){
      const data = yield call(deletePayment,{id:payload})
      if(data.success){
        yield put({
          type:'queryPayment'
        })
        notification['success']({
          message:'Saved'
        })
      }
    },

    *searchUser({payload},{call,put,select}){
      const data = yield call(searchUser,{name:payload})
      console.log(data)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            userList:data.object
          }
        })
      }
    },
    *savePayment({payload},{call,put,select}){
      payload.payDate = new Date(payload.payDate).getTime()
      const data = yield call(savePayment,payload);
      if(data.success){
        notification['success']({
          message:'Saved'
        })
        yield put({
          type:'updateState',
          payload:{
            modalVisible: false
          }
        })
        yield put({
          type:'queryPayment'
        })
      }
    },
    *queryPayType({payload},{call,put,select}){
      const data = yield call(getPayTypes)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            payTypes:data._embedded.list
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
