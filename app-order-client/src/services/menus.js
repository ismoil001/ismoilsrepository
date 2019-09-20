import { request, config } from 'utils'

const { api } = config
const { menus } = api

export function query (params) {
  return request({
    url: menus,
    method: 'get',
    data: params,
  })
}

export function querybyrole (params) {
  return request({
    url: '/api/menu/search/byrole',
    method: 'get',
    data: params,
  })
}
