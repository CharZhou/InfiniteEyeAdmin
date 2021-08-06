import { businessRequest } from './base'

export async function getAllowedDataPropertyType() {
  return businessRequest('/dataproperty/config/allowedDataPropertyType', 'get')
}

export async function getDataTransferRule() {
  return businessRequest('/dataproperty/config/dataTransferRule', 'get')
}

export async function getDataPropertyData(propertyId) {
  return businessRequest(`/dataproperty/${propertyId}`, 'get')
}

export async function updateDataProperty(propertyId, propertyData) {
  return businessRequest(`/dataproperty/${propertyId}`, 'patch', propertyData)
}

export async function addDataProperty(propertyData) {
  return businessRequest('/dataproperty/', 'put', propertyData)
}

export async function delDataProperty(propertyId) {
  return businessRequest(`/dataproperty/${propertyId}`, 'delete')
}

