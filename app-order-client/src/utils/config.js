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
    userLogin: `${API}/auth/login`,
    userLogout: `${API}/user/logout`,
    userInfo: `${API}/userInfo`,
    posts: `${API}/posts`,
    user: `${API}/user/:id`,
    dashboard: `${API}/dashboard`,
    menus: `${API}/menu`,
    paymentrules:`${API}/paymentrule`,
    weather: `${API}/weather`,
    v1test: `${API}/test`,
    v2test: `${API}/test`,
  },
};
