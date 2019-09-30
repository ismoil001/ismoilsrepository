import {saveOrder,getCustomers,changeStatusOrder,
  getActiveOrders,editOrder,deleteOrder,
  saveOrderPayment} from './service'
import {notification} from "antd";
import {searchUser} from "../payment/service";
import {getCompany,addCompany,getNumbers,
  deleteNumber,addPhoneNumber} from './service';
export default {
  namespace: 'settings',
  state: {
    company:'',
    numbers:[],
    phoneNumberValue:''
  },

  subscriptions: {

    //
    // setup({dispatch, history}) {
    //   return history.listen(({pathname, query}) => {
    //     if (pathname === '/settings') {
    //       dispatch({
    //         type:'getCompany',
    //       })
    //       dispatch({
    //         type:'getPhoneNumbers',
    //       })
    //     }
    //   });
    // },
  },

  effects: {
    *getCompany({payload},{call,put,select}){
      const data = yield call(getCompany);
      console.log(data)
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            company:data.object.length>0? data.object[0]:''
          }
        })
      }
    },
    *getPhoneNumbers({payload},{call,put,select}){
      const data = yield call(getNumbers);
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            numbers:data.object
          }
        })
      }
    },
    *deleteNumber({payload},{call,put,select}){
      const data = yield call(deleteNumber,payload)
      if(data.success){
        notification["success"]({
          message:"Deleted"
        })
        yield put({
          type:'getPhoneNumbers'
        })
      }
    },
    *addPhoneNumber({payload},{call,put,select}){
      const data = yield call(addPhoneNumber,payload)
      if(data.success){
        notification["success"]({
          message:"Deleted"
        })
        yield put({
          type:'getPhoneNumbers'
        })
        yield put({
          type:'updateState',
          payload:{
            phoneNumberValue:''
          }
        })
      }
    },
    *saveCompany({payload},{call,put,select}){
      const data = yield call(addCompany,payload)
      if(data.success){
        notification["success"]({
          message:"Added"
        })
        yield put({
          type:'getCompany'
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
