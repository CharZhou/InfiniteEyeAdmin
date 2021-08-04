import request from '@/utils/request'

async function commonRequest(uri, method, data, params) {
  const requestConfig = {
    url: uri,
    method: method,
    params: {},
    data: {}
  }
  if (method === 'get') {
    Object.assign(requestConfig.params, data)
  } else {
    Object.assign(requestConfig.data, data)
  }
  Object.assign(requestConfig.params, params)
  // console.log(requestConfig)
  // console.log(requestConfig)
  return request(requestConfig)
}

export async function businessRequest(uri, method, data = {}) {
  const result = await commonRequest(uri, method, data, {})
  return result.data
}

export async function paginationRequest(uri, method, pageNum, pageSize, data = {}) {
  const result = await commonRequest(uri, method, data, {
    pagenum: pageNum,
    pagesize: pageSize
  })
  if (result.total) {
    return [result.data, result.total]
  } else {
    return result.data
  }
}
