const API = '/api';

module.exports = {
  name: 'Euro print',
  messageHeader:'App Euro print',
  prefix: 'appOrder',
  footerText: '© 2018 Personal Development Process',
  logo: '/public/logo.png',
  iconFontCSS: '/public/iconfont.css',
  iconFontJS: '/public/iconfont.js',
  CORS: [],
  openPages: ['/login','/'],
  apiPrefix: '/api',
  API,
  api: {
    getManagers:`${API}/users/managers`,
    saveUser:`${API}/users`,
    delMan:`${API}/users`,
    editManager:`${API}/users`,
    userLogin: `${API}/auth/login`,
    userLogout: `${API}/users/logout`,
    userInfo: `${API}/userInfo`,
    posts: `${API}/posts`,
    user: `${API}/users/:id`,
    dashboard: `${API}/dashboard`,
    menus: `${API}/menu`,
    paymentrules:`${API}/paymentrule`,
    weather: `${API}/weather`,
    v1test: `${API}/test`,
    v2test: `${API}/test`,
    saveAttachment:`${API}/file/save`,
    getAttachment:`${API}/file/get`
  },
};
