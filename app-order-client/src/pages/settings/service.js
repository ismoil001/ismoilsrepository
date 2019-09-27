import { request } from 'utils'

export function getCompany () {
  return request({
    url: '/api/company',
    method: 'get',
  })
}
export function addCompany (data) {
  return request({
    url: '/api/company',
    method: 'post',
    data,
  })
}
export function getNumbers () {
  return request({
    url: '/api/phonenumber',
    method: 'get',
  })
}
export function addPhoneNumber (data) {
  return request({
    url: '/api/phonenumber',
    method: 'post',
    data,
  })
}
export function deleteNumber (data) {
  return request({
    url: '/api/phonenumber/'+data.id,
    method: 'delete',
    data,
  })
}