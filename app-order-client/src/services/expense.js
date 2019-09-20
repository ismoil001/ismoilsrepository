import { request, config } from 'utils'


export function query (params) {
  return request({
    url: '/api/expense',
    method: 'get',
    data: params,
  })
}

export function queryTemplateById (params) {
  
  return request({
    url: params,
    method: 'get',
  })
}



export function create (params) {
  return request({
    url: '/api/expense',
    method: 'post',
    data: params,
  })
}


export function remove(params) {
  return request({
    url: '/api/expense/' + params.id,
    method: 'delete',
    data: params,
  })
}

export function removeTemplate(params) {
  return request({
    url: '/api/expensetemplate/' + params.id,
    method: 'delete',
    data: params,
  })
}


export function edit (params) {
  return request({
    url: '/api/expense/'+params.id,
    method: 'patch',
    data: params,
  })
}


export function queryExpenseTemplate (params) {
  return request({
    url: '/api/expensetemplate',
    method: 'get',
    data: params,
  })
}


export function addTemplate (params) {
  return request({
    url: '/api/expensetemplate',
    method: 'post',
    data: params,
  })
}
