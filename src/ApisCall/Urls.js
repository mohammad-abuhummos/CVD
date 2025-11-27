// src/ApisCall/Urls.js
export function GetBaseUrl() {
  return "http://172.17.1.15:5509/api";
}

export function GetLoginUrl() {
  return `${GetBaseUrl()}/Auth/login`;
}

export function YardsBaseUrl() {
  return `${GetBaseUrl()}/Yard`;
}

export function CamerasBaseUrl() {
  return `${GetBaseUrl()}/Camera`;
}

export function YardsCamerasBaseUrl() {
  return `${GetBaseUrl()}/YardCamera`;
}

export function YardCameraAssignUrl() {
  return `${GetBaseUrl()}/YardCamera/assign`;
}

export function YardCameraUnassignUrl() {
  return `${GetBaseUrl()}/YardCamera/unassign`;
}

export function downloadVideosBaseUrl() {
  return `${GetBaseUrl()}/Videos/DownloadVideo`;
}