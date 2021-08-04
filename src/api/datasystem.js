import { businessRequest, paginationRequest } from './base'

export async function listDataSystem(pageNum, pageSize) {
  return paginationRequest('/datasystem/', 'get', pageNum, pageSize)
}

export async function getDataSystemData(systemId) {
  return businessRequest(`/datasystem/${systemId}`, 'get')
}

export async function addDataSystemData(systemName, databaseName) {
  return businessRequest('/datasystem/', 'put', {
    systemName,
    databaseName
  })
}

export async function delDataSystemData(systemId) {
  return businessRequest(`/datasystem/${systemId}`, 'delete')
}

