import {uploadFile} from 'services/attachmentService.js'
import {addMaster,getMasters,removeMaster,upodateMas}from 'services/app.js';
export default ({
  namespace:'master',
  state:{
    masters:[],
    photoUrl:'',
    currentMaster:{},
    isEdit:false
  },
  subscriptions:{

  },
  effects:{
    * allMasters({payload},{call,put,select}){
      const res=yield call(getMasters)
      console.log(res)
      yield put({
        type:'updateState',
        payload:{
          masters: res.object
        }
      })
    },
    * saveMasterPhoto({payload},{call,put,select}){
      const res=yield call(uploadFile,payload.options);
      console.log(res);
      yield put({
        type:'updateState',
        payload:{
          photoUrl: res.id
        }
      });

    },
    * createMaster({payload},{call,put,select}){
      const res =yield call(addMaster,payload);
      console.log(res);
      yield put({
        type:'updateState',
        payload:{
          currentMaster: res.object
        }
      });
      yield put({
        type:'allMasters'
      })
    },
    * deleteMaster({payload},{call,put,select}){
      const res=yield call(removeMaster,payload.id)
      console.log(res);
      yield put({
        type:'allMasters'
      })
    },
    * edMaster({payload},{call,put,select}){
      const res=yield call(upodateMas,payload)
      console.log(res);
      yield put({
        type:'allMasters'
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
})
