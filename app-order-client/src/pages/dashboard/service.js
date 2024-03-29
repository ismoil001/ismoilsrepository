import { request } from 'utils'

export function saveOrder (data) {
  return request({
    url: '/api/order',
    method: 'post',
    data,
  })
}
export function editOrder (data) {
  return request({
    url: '/api/order/'+data.id,
    method: 'put',
    data,
  })
}
export function deleteOrder (data) {
  return request({
    url: '/api/order/'+data.id,
    method: 'delete',
    data,
  })
}
export function saveOrderPayment (data) {
  return request({
    url: '/api/orderPayment',
    method: 'post',
    data,
  })
}
export function getCustomers (data) {
  return request({
    url: '/api/users/customer',
    method: 'get',
    data,
  })
}
export function changeStatusOrder (data) {
  return request({
    url: '/api/order/changeStatus/'+data,
    method: 'post',
    data,
  })
}
export function changeStatusOrder1 (data) {
  return request({
    url: '/api/order/changeStatus1/'+data,
    method: 'post',
    data,
  })
}
export function getActiveOrders (data) {
  return request({
    url: '/api/order/active',
    method: 'get',
    data,
  })
}
