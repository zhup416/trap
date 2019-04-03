import Cookies from 'js-cookie'

export function TokenKey() {
  return 'XX-Token'
}

export function DeviceTypeKey() {
  return 'XX-Device-Type'
}

export function getToken() {
  return Cookies.get(TokenKey())
}

export function setToken(token) {
  return Cookies.set(TokenKey(), token)
}

export function removeToken() {
  return Cookies.remove(TokenKey())
}

export function getDeviceType() {
  return Cookies.get(DeviceTypeKey())
}

export function setDeviceType(deviceType) {
  return Cookies.set(DeviceTypeKey(), deviceType)
}

export function removeDeviceType() {
  return Cookies.remove(DeviceTypeKey())
}
