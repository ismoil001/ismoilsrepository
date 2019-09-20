import modelExtend from 'dva-model-extend'
import {create, remove, update, query, search, removeMultiple, queryLang, queryEduCenter, queryStudentStatus} from "../services/tableService";
import {config} from 'utils'
import {notification} from "antd";


const {prefix} = config;

export const model = {
  reducers: {
    updateState(state, {payload}) {
      return {
        ...state,
        ...payload,
      }
    },
  }
};

export const pageModel = modelExtend(model, {
  state: {
    list: [],
    columns: [],
    pagination: {
      showSizeChanger: true,
      showQuickJumper: true,
      showTotal: total => `Total ${total} Items`,
      current: 1,
      total: 0,
      pageSize: 10,
    },
  },

  reducers: {
    querySuccess(state, {payload}) {
      const {list, pagination} = payload;
      return {
        ...state,
        list,
        pagination: {
          ...state.pagination,
          ...pagination,
        },
      }
    },
  },

});

export const tableModel = modelExtend(pageModel, {
  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    isTableRefresh: false,
    isMotion: window.localStorage.getItem(`${prefix}IsMotion`) === 'true',
    languages: [],
  },
  effects: {
    * query({payload={}}, {call, put, select}) {
      const {app} = yield (select(_ => _));
      payload.apiPath = app.apiPath;
      payload.current = Number(payload.current)-1
      const data = yield call(payload.search !== undefined ? search : query, payload!==undefined?payload:'');

      payload.current = Number(payload.current)+1
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data._embedded.list,
            pagination: {
              current: payload.current,
              pageSize: Number(payload.pageSize),
              total: Number(data.page.totalElements),
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: total => `Total ${total} Items`,
            },
          },
        })
      }
    },

    * delete({payload}, {call, put, select}) {
      const {app} = yield (select(_ => _));

      const data = yield call(remove, {id: payload, apiPath: app.apiPath});
      notification[data.success?'success':'error']({
        message: data.success ? "O'chirildi":'Xatolik',
        description: data.success ? 'deleted successfuly':"Bu obyekt tizmda foydalanilayotganligi uchun uni o'chira olmaysiz" ,
        placement: 'bottom',
      });


    },

    * multiDelete({payload}, {call, put, select}) {
      const {app} = yield (select(_ => _));
      const data = yield call(removeMultiple, {ids: payload, apiPath: app.apiPath});
      if(data.result === false){
      notification[data.result?'success':'error']({
        message: data.result ? 'Deleted':'Eror',
        description: data.result ? 'deleted successfuly':'some of this objects are using by another try after deleting this father' ,
        placement: 'bottom',
      });}
      if (data.success) {
        yield put({type: 'updateState', payload: {selectedRowKeys: []}})
      } else {
        throw data
      }
    },

    * create({payload}, {call, put, select}) {
      const {app} = yield (select(_ => _));
      payload.apiPath = app.apiPath;

      const data = yield call(create, payload);
      notification[data.success?'success':'error']({
        message: data.success ? "Qo'shildi":'Xatolik',
        description: data.success ? "Muvaffaqiyatli qo'shildi":"Qo'shishda xatolik yuz berdi" ,
        placement: 'bottom',
      });
      if (data.success) {
        yield put({type: 'hideModal'})
      } else {
        throw data
      }
    },

    * update({payload}, {select, call, put}) {
      const allModel = yield (select(_ => _));
      const {app} = allModel;

      let id = '';
      Object.keys(allModel).map(function (key) {
        if (app.childModel === key) {
          id = allModel[key].currentItem.id;
        }
      });
      payload.apiPath = app.apiPath;
      const newObject = {...payload, id};

      const data = yield call(update, newObject);
      notification[data.success?'success':'error']({
        message: data.success ? 'Edited':'Eror',
        description: data.success ? 'edited successfuly':'eror in editing' ,
        placement: 'bottom',
      });
      if (data.success) {
        yield put({type: 'hideModal'})
      } else {
        throw data
      }
    },


  },

  reducers: {
    showModal(state, {payload}) {
      return {...state, ...payload, modalVisible: true}
    },
    hideModal(state) {
      return {...state, modalVisible: false}
    },
    switchIsMotion(state) {
      window.localStorage.setItem(`${prefix}IsMotion`, !state.isMotion);
      return {...state, isMotion: !state.isMotion}
    },
    switchColumn(state, {payload}) {
      return {
        ...state,
        visibleColumns: payload,
      }
    },
    tableRefresh(state, {payload}){
      return{
        ...state,
        isTableRefresh: payload
      }
    }
  }
});

