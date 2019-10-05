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
    loadingModal:false,
    searchValue:'',
    isArchive:false,
    totalElements:0,
    page:0
  },

  subscriptions: {


    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname === '/payment') {
          dispatch({
            type:'queryPayType'
          })
          dispatch({
            type:'updateState',
            payload:{
              isArchive:false
            }
          })
          dispatch({
            type:'queryPayment',
            payload:{
              page:0,
              size:10,
              name:'',
              isArchive:false
            }
          })
        }
      });
    },
  },

  effects: {

    *queryPayment({payload},{call,put,select}){
      const data = yield call(getPayments,payload);
      console.log(data)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            paymentList:data.object,
            page:data.currentPage+1,
            totalElements:data.totalElements
          }
        })
      }
    },

    *deletePayment({payload},{call,put,select}){
      const {isArchive} = yield select(_=>_.payment);
      const data = yield call(deletePayment,{id:payload})
      if(data.success){
        yield put({
          type:'queryPayment',
          payload:{
            page:0,
            size:10,
            name:'',
            isArchive: isArchive
          }
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
      const {isArchive} = yield select(_=>_.payment);
      payload.payDate = new Date(payload.payDate).getTime()
      payload.paySum = payload && parseFloat(payload.paySum.replace(/\s/g, ''))
      const data = yield call(savePayment,payload);
      if(data.success){
        notification['success']({
          message:data.message==="false"?"success":"Saqlandi va barchasi buyurtma hisobiga yechildi."
        })
        yield put({
          type:'updateState',
          payload:{
            modalVisible: false,
            isArchive:true,
          }
        })
        yield put({
          type:'queryPayment',
          payload:{
            page:0,
            size:10,
            name:'',
            isArchive:data.message === "true"
          }
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
