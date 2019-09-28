import {request, config} from 'utils'

const {api} = config;
const {saveUser, userLogout, userLogin,
  editManager,getManagers,delMan} = api;

export function editManag(data) {
  console.log(data)
  return request({
    url:editManager+"/"+data.id,
    method:'put',
    data:data.data
  })
}
export function saveManager(req) {
  return request({
    url: saveUser,
    method: 'post',
    data:req
  })

}

export function managers() {
  return request({
    url: getManagers,
    method: 'get'
  })
}
export function getCompany() {
  return request({
    url: '/api/homepage',
    method: 'get'
  })
}

export function deleteManager(id) {
  return request({
    url:delMan+"/"+id.path,
    method:'delete'
  })
}

export function login(params) {
  return request({
    url: userLogin,
    method: 'post',
    data: params,
  })
}

export function logout(params) {
  return request({
    url: userLogout,
    method: 'get',
    data: params,
  })
}

export function query(params) {
  return request({
    url: '/api/users/me',
    method: 'get',
    data: params,
  })
}
