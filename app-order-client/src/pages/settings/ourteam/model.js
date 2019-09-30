import {savePhoto,getPhoto} from 'services/app'
export default ({
  namespace:'master',
  state:{
    masters:[],
    photoUrl:''
  },
  subscriptions:{

  },
  effects:{
    * saveMasterPhoto({payload},{call,put,select}){
      const res=yield call(savePhoto,payload);
      console.log(res);
      // yield put({
      //   type:'updateState',
      //   payload:{
      //     photoUrl: res.object.fileUrl
      //   }
      // })
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
