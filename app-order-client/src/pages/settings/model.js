import {uploadFile} from "../../services/attachmentService";
import {notification} from "antd";
import {searchUser} from "../payment/service";
import {
  getCompany,
  addCompany,
  getNumbers,
  deleteNumber,
  addPhoneNumber,
  getAllPortfolio,
  savePortfolio
} from './service';

export default {
  namespace: 'settings',
  state: {
    company: '',
    numbers: [],
    phoneNumberValue: '',
    loadingImage: false,
    oldAttachment: '',
    photo: '',
    portfolioList:[]
  },

  subscriptions: {


    setup({dispatch, history}) {
      return history.listen(({pathname, query}) => {
        if (pathname.includes('/settings')) {
          dispatch({
            type: 'getCompany',
          })
          dispatch({
            type: 'getPortfolios',
          })
        }
      });
    },
  },

  effects: {

    * getPortfolios({payload}, {call, put, select}) {
      const data = yield call(getAllPortfolio)
      yield put({
        type:'updateState',
        payload:{
          portfolioList:data.object
        }
      })

    },

    * savePortfolio({payload}, {call, put, select}) {
      const data = yield call(savePortfolio, payload);
      if(data.success){
        yield put({
          type:'updateState',
          payload:{
            portfolioList:data.object
          }
        })
        yield put({
          type:'getPortfolios',
        })
      }
    },

    * uploadFile({payload = {}}, {call, put, select}) {
      const {photo} = yield select(_ => _.settings);
      if (photo !== '') {
        yield put({
          type: 'updateState',
          payload: {
            loadingImage: true,
            oldAttachment: photo.split('/')[photo.split('/').length - 1]
          },
        });
      }
      const res = yield call(uploadFile, payload.options);
      payload.options.onSuccess(res, payload.options.file);
      yield put({
        type: 'savePortfolio',
        payload: {
          attachment: res.id
        }
      })
    },

    * getCompany({payload}, {call, put, select}) {
      const data = yield call(getCompany);
      console.log(data)
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            company: data.object.length > 0 ? data.object[0] : ''
          }
        })
      }
    },
    * getPhoneNumbers({payload}, {call, put, select}) {
      const data = yield call(getNumbers);
      if (data.success) {
        yield put({
          type: 'updateState',
          payload: {
            numbers: data.object
          }
        })
      }
    },
    * deleteNumber({payload}, {call, put, select}) {
      const data = yield call(deleteNumber, payload)
      if (data.success) {
        notification["success"]({
          message: "Deleted"
        })
        yield put({
          type: 'getPhoneNumbers'
        })
      }
    },
    * addPhoneNumber({payload}, {call, put, select}) {
      const data = yield call(addPhoneNumber, payload)
      if (data.success) {
        notification["success"]({
          message: "Deleted"
        })
        yield put({
          type: 'getPhoneNumbers'
        })
        yield put({
          type: 'updateState',
          payload: {
            phoneNumberValue: ''
          }
        })
      }
    },
    * saveCompany({payload}, {call, put, select}) {
      const data = yield call(addCompany, payload)
      if (data.success) {
        notification["success"]({
          message: "Added"
        })
        yield put({
          type: 'getCompany'
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
