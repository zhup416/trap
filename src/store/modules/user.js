import { login, logout, getInfo } from '@/api/user/login'
import { getToken, setToken, removeToken, getDeviceType, setDeviceType, removeDeviceType } from '@/utils/auth'

const user = {
  state: {
    token: getToken(),
    device_type: getDeviceType(),
    name: '',
    avatar: '',
    authRules: [],
    menus: {},
    isNullRules: 0
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_DEVICE_TYPE: (state, device_type) => {
      state.device_type = device_type
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_AUTH_RULES: (state, authRules) => {
      state.authRules = authRules
    },
    SET_MENUS: (state, menus) => {
      state.menus = menus
    },
    SET_IS_NULL_RULES: (state, isNullRules) => {
      state.isNullRules = isNullRules
    }
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      const captcha = userInfo.captcha.trim()
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.device_type, captcha).then(response => {
          const data = response.data
          setToken(data.token)
          commit('SET_TOKEN', data.token)
          setDeviceType(userInfo.device_type)
          commit('SET_DEVICE_TYPE', userInfo.device_type)
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo(state.token).then(response => {
          const data = response.data
          commit('SET_NAME', data.name)
          commit('SET_AVATAR', data.avatar)
          commit('SET_AUTH_RULES', data.auth_rules ? data.auth_rules : [])
          commit('SET_MENUS', data.menus ? data.menus : {})
          commit('SET_IS_NULL_RULES', data.auth_rules ? (data.auth_rules.length === 0 ? 1 : 0) : 1)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
          commit('SET_AUTH_RULES', [])
          commit('SET_MENUS', undefined)
          commit('SET_DEVICE_TYPE', '')
          removeToken()
          removeDeviceType()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
