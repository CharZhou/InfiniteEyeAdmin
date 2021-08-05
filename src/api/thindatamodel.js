import { businessRequest, paginationRequest } from './base'

export async function listThinDataModel(pageNum, pageSize) {
  return paginationRequest('/thindata/', 'get', pageNum, pageSize)
}

export async function getThinDataModelData(modelId) {
  return businessRequest(`/thindata/${modelId}`, 'get')
}

export async function updateThinDataModelData(modelId, modelData) {
  return businessRequest(`/thindata/${modelId}`, 'patch', modelData)
}

export async function addThinDataModel(modelName, systemId) {
  return businessRequest('/thindata/', 'put', {
    name: modelName,
    systemId
  })
}

export async function delThinDataModel(modelId) {
  return businessRequest(`/thindata/${modelId}`, 'delete')
}

export async function queryThinDataModel(modelId, queryCondition, queryOption = {}) {
  return businessRequest(`/thindata/${modelId}`, 'post', {
    queryCondition,
    queryOption
  })
}

export async function removeThinDataModelDataProperty(modelId, propertyId) {
  return businessRequest(`/thindata/${modelId}/${propertyId}`, 'delete')
}

export async function addFatThinModelDataProperty(modelId, propertyId) {
  return businessRequest(`/thindata/${modelId}/property`, 'put', {
    propertyId
  })
}
