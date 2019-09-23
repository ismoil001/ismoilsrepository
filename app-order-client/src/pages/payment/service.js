import { request } from 'utils'

export function searchUser (data) {
  return request({
    url: '/api/users/search',
    method: 'get',
    data,
  })
}
export function getPayTypes (data) {
  return request({
    url: '/api/payType',
    method: 'get',
    data,
  })
}
export function getPayments (data) {
  return request({
    url: '/api/payment',
    method: 'get',
    data,
  })
}
export function savePayment (data) {
  return request({
    url: '/api/payment',
    method: 'post',
    data,
  })
}
export function deletePayment (data) {
  return request({
    url: '/api/payment/'+data.id,
    method: 'delete',
    data,
  })
}
export function doAksverka (data) {
  return request({
    url: '/api/order/aksverka',
    method: 'get',
    data,
  })
}
