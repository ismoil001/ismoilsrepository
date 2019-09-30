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
export function getAllPortfolio (data) {
  return request({
    url: '/api/portfolio',
    method: 'get',
  })
}
export function savePortfolio (data) {
  return request({
    url: '/api/portfolio',
    method: 'post',
    data,
  })
}
export function deletePortfolio (data) {
  return request({
    url: '/api/portfolio/'+data.id,
    method: 'delete'
  })
}
export function deleteNumber (data) {
  return request({
    url: '/api/phonenumber/'+data.id,
    method: 'delete',
    data,
  })
}
