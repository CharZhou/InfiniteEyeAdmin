import { businessRequest, paginationRequest } from './base'

export async function listFatDataModel(pageNum, pageSize) {
  return paginationRequest('/fatdata/', 'get', pageNum, pageSize)
}

export async function getFatDataModelData(modelId) {
  return businessRequest(`/fatdata/${modelId}`, 'get')
}

export async function updateFatDataModelData(modelId, modelData) {
  return businessRequest(`/fatdata/${modelId}`, 'patch', modelData)
}

export async function addFatDataModel(modelName, collectionName, systemId, propertyId) {
  return businessRequest('/fatdata/', 'put', {
    name: modelName,
    collectionName,
    systemId,
    propertyId
  })
}

export async function delFatDataModel(modelId) {
  return businessRequest(`/fatdata/${modelId}`, 'delete')
}

export async function queryFatDataModel(modelId, queryCondition, queryOption = {}) {
  return businessRequest(`/fatdata/${modelId}`, 'post', {
    queryCondition,
    queryOption
  })
}

export async function removeFatDataModelDataProperty(modelId, propertyId) {
  return businessRequest(`/fatdata/${modelId}/${propertyId}`, 'delete')
}

export async function addFatDataModelDataProperty(modelId, propertyId) {
  return businessRequest(`/fatdata/${modelId}/property`, 'put', {
    propertyId
  })
}
