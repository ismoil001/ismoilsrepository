import {managers,saveManager,
  deleteManager,editManag} from 'services/app'

export default {
  namespace: 'manager',
  state: {
    allManagers: [],
    openAddModal:false,
    openDeleteModal:false,
    record:{},
    recordId:'',
    isEdit:false
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
    * getManager({payload}, {call, put, select}) {
      const res = yield call(managers);
      console.log(res);
      yield put({
        type:'updateState',
        payload:{
          allManagers: res.list
        }
      })
    },
    * saveManager({payload},{call,put,select}){
      const res=yield call(saveManager,payload);
      const {openAddModal}=yield select(_=>_.manager);
      console.log(res);
      yield put({
        type:'updateState',
        payload:{
          openAddModal:!openAddModal
        }
      });
      yield put({
        type:'getManager'
      })
    },
    * delManager({payload},{call,put,select}){
      const res=yield call(deleteManager,payload);
      console.log(res);
      yield put({
        type:'getManager'
      });
      yield put({
        type:'updateState',
        payload:{
          openDeleteModal: false
        }
      })
    },
    * editingManager({payload},{call,put,select}){
      const res=yield call(editManag,payload)
      console.log(res);
      yield put({
        type:'getManager'
      });
      yield put({
        type:'updateState',
        payload:{
          openAddModal:false
        }
      })

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
