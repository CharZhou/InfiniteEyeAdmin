import { businessRequest } from './base'

export async function getDataPropertyData(propertyId) {
  return businessRequest(`/dataproperty/${propertyId}`, 'get')
}

export async function addDataProperty(propertyName, propertyKey, propertyType, propertyRef) {
  return businessRequest('/dataproperty/', 'put', {
    name: propertyName,
    key: propertyKey,
    type: propertyType,
    ref: propertyRef
  })
}

export async function delDataProperty(propertyId) {
  return businessRequest(`/dataproperty/${propertyId}`, 'delete')
}

