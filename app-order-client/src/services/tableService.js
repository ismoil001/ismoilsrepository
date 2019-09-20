import {request} from 'utils'

export function query(params) {
  const path = params.apiPath;
  if(path==="/api/expense")
  {
    delete params.apiPath;
    return request({
      url: path+'?page=0&size=100&sort=createdAt,desc',
      method: 'get',
      data: params,
    })
  }
  else {
    delete params.apiPath;
    return request({
      url: path + '?page=0&size=100',
      method: 'get',
      data: params,
    })
  }
}
export function queryProd(params) {
  return request({
    url: '/api/product',
    method: 'get',
    data: params,
  })
}

export function qloan(params) {
  return request({
    url: '/api/customerloan',
    method: 'get',
    data: params,
  })
}

export function queryUser(params) {

  return request({
    url: '/api/users',
    method: 'get',
    data: params,
  })
}

export function search(params) {
  const path = params.apiPath;
  delete params.apiPath;
  return request({
    url: path+"/search/advancedSearch",
    method: 'get',
    data: params,
  })
}

export function create(params) {
  const path = params.apiPath;
  delete params.apiPath;


  return request({
    url: path,
    method: 'post',
    data: params,
  })
}

export function remove(params) {


  const path = params.apiPath;
  delete params.apiPath;
  return request({
    url: path + '/' + params.id,
    method: 'delete',
    data: params,
  })
}

export function update(params) {
  const path = params.apiPath;
  delete params.apiPath;
  return request({
    url: path + '/' + params.id,
    method: 'patch',
    data: params,
  })
}

export function removeMultiple(params) {
  const path = params.apiPath;
  delete params.apiPath;
  return request({
    url: path + '/deleteMultiple',
    method: 'delete',
    data: params.ids,
  })
}

export function queryLang(params) {
  return request({
    url: '/api/language',
    method: 'get',
    data: params,
  })
}
export function queryEduCenter(params) {
  return request({
    url: '/api/edu_center',
    method: 'get',
    data: params,
  })
}
export function queryStudentStatus(params) {
  return request({
    url: '/api/student_status',
    method: 'get',
    data: params,
  })
}
export function queryExpenseTemplate(params) {
  return request({
    url: '/api/expensetemplate',
    method: 'get',
    data: params,
  })
}
export function queryTutorStatus(params) {
  return request({
    url: '/api/tutor_status',
    method: 'get',
    data: params,
  })
}
export function queryStudents(params) {
  return request({
    url: '/api/student',
    method: 'get',
    data: params,
  })
}
export function queryPayTypes(params) {
  return request({
    url: '/api/pay_type',
    method: 'get',
    data: params,
  })
}
export function queryPayments(params) {
  return request({
    url: '/api/payment',
    method: 'get',
    data: params,
  })
}


export function queryCategorys(params) {
  return request({
    url: '/api/category/search/notapok',
    method: 'get',
    data: params,
  })
}
export function searchProduct(params) {
  return request({
    url: '/api/product/search/byname',
    method: 'get',
    data: params,
  })
}
export function queryLoans(params) {
  return request({
    url: '/api/customerloan/activeloan',
    method: 'get',
    data: params,
  })
}
export function queryProducts(params) {
  return request({
    url: '/api/product',
    method: 'get',
    data: params,
  })
}

export function queryProductsDeletable(params) {
  return request({
    url: '/api/product/search/withoutStock',
    method: 'get',
    data: params,
  })
}
export function deleteProductById(params) {
  return request({
    url: '/api/product/'+params.id,
    method: 'delete',
  })
}
export function historyLoan(params) {
  return request({
    url: '/api/customerloan/search/bycustomerName',
    method: 'get',
    data:params
  })
}

export function saveLoan(params) {
  return request({
    url: '/api/customerloan',
    method: 'post',
    data:params
  })
}
export function deleteLoanById(params) {
  return request({
    url: '/api/customerloan/'+params,
    method: 'delete',
    data:{
      id:params
    }
  })
}

export function queryClients(params) {
  return request({
    url: '/api/customer',
    method: 'get',
    data:params
  })
}
export function searchSaleByNum(params) {
  return request({
    url: '/api/saleBack/search1',
    method: 'get',
    data:params
  })
}

export function getSaleById(params) {
  return request({
    url: '/api/sale/search/getById/?projection=customSale',
    method: 'get',
    data:params
  })
}
export function doBack(params) {
  return request({
    url: '/api/payment/back',
    method: 'post',
    data:params
  })
}

export function searchByDate(params) {
  return request({
    url: '/api/saleBack/search',
    method: 'get',
    data:params
  })
}

export function getSaleBackList(params) {
  return request({
    url: '/api/saleBack/list',
    method: 'get',
    data:params
  })
}

export function queryCategorysWithoutNumber(params) {
  return request({
    url: '/api/queryCateg/list',
    method: 'get',
    data:params
  })
}

export function saveExcellCateg(params) {
  return request({
    url: '/api/readingE/categ',
    method: 'post',
    data:{
      id:params
    }

  })
}
