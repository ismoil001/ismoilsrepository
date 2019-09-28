/* global window */
/* global document */
/* global location */
/* eslint no-restricted-globals: ["error", "event"] */

import {routerRedux} from 'dva/router'
import {parse} from 'qs'
import config from 'config'
import {EnumRoleType} from 'enums'
import {query, logout,getCompany} from 'services/app'
import * as menusService from 'services/menus'
import queryString from 'query-string'
import {TOKEN_NAME} from "../constants";

const {prefix} = config;

export default {
  namespace: 'app',
  state: {
    apiPath: '',
    childModel: '',
    user: {},
    company:'',
    permissions: {
      visit: [],
    },
    menu: [
      {
        id: 1,
        icon: 'laptop',
        name: 'Dashboard',
        router: '/dashboard',
      },
    ],
    menuPopoverVisible: false,
    siderFold: window.localStorage.getItem(`${prefix}siderFold`) === 'true',
    darkTheme: window.localStorage.getItem(`${prefix}darkTheme`) === 'true',
    isNavbar: document.body.clientWidth < 769,
    navOpenKeys: JSON.parse(window.localStorage.getItem(`${prefix}navOpenKeys`)) || [],
    locationPathname: '',
    locationQuery: {},
    homeData:'',
    clear:false
  },
  subscriptions: {
    setupHistory({dispatch, history}) {
      history.listen((location) => {
        dispatch({
          type: 'updateState',
          payload: {
            locationPathname: location.pathname,
            locationQuery: location.query,
          },
        })
      })
    },

    setup({dispatch,history}) {

      history.listen(({ pathname }) => {
          if (!config.openPages.includes(pathname)){
            dispatch({type: 'query'});

          }
          if(pathname==="/"){
            dispatch({
              type:'homePageData'
            })
          }
      });

    },

  },
  effects: {

    *homePageData({payload},{call,put,select}){
      const data = yield call(getCompany);
      console.log(data)
      yield put({
        type:'updateState',
        payload:{
          company:data.object&& data.object.company,
          homeData:data.object
        }
      })
    },

    * query({
              payload,
            }, {call, put, select}) {

      const user = yield call(query, payload);
      console.log(user);
      const {locationPathname} = yield select(_ => _.app);
      if (typeof user !== 'undefined') {
        yield put({
          type:'updateState',
          payload:{
            user:user
          }
        });
        if (location.pathname === '/login') {
          yield put(routerRedux.push({
            pathname: '/dashboard',
          }));

        }
      } else if (config.openPages && config.openPages.indexOf(locationPathname) < 0) {
        yield put(routerRedux.push({
          pathname: '/login',
          search: queryString.stringify({
            from: locationPathname,
          }),
        }))
      }
    },

    * logout({
               payload,
             }, {call, put}) {
      try {
        const data = yield call(logout, parse(payload));
      } catch (e) {
      }
      localStorage.removeItem(TOKEN_NAME);
      yield put({
        type: 'updateState', payload: {
          user: {},
          permissions: {visit: []},
          menu: [{
            id: 1,
            icon: 'laptop',
            name: 'Dashboard',
            router: '/dashboard',
          }],
        }
      });
      yield put({type: 'query'});


    },

    * changeNavbar(action, {put, select}) {
      const {app} = yield (select(_ => _));
      const isNavbar = document.body.clientWidth < 769;
      if (isNavbar !== app.isNavbar) {
        yield put({type: 'handleNavbar', payload: isNavbar})
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

    switchSider(state) {
      window.localStorage.setItem(`${prefix}siderFold`, !state.siderFold);
      return {
        ...state,
        siderFold: !state.siderFold,
      }
    },

    switchTheme(state) {
      window.localStorage.setItem(`${prefix}darkTheme`, !state.darkTheme);
      return {
        ...state,
        darkTheme: !state.darkTheme,
      }
    },

    switchMenuPopver(state) {
      return {
        ...state,
        menuPopoverVisible: !state.menuPopoverVisible,
      }
    },

    handleNavbar(state, {payload}) {
      return {
        ...state,
        isNavbar: payload,
      }
    },

    handleNavOpenKeys(state, {payload: navOpenKeys}) {
      return {
        ...state,
        ...navOpenKeys,
      }
    },
  },
}
