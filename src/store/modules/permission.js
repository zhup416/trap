import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.auth_rule判断是否与当前用户权限匹配
 * @param menus
 * @param route
 */
function hasPermission(menus, route) {
  if (route.meta && route.meta.auth_rule) {
    let flag = false
    for (var key in menus) {
      if (key === route.meta.auth_rule) {
        flag = true
        break
      }
      if (menus[key]['items']) {
        flag = hasPermission(menus[key]['items'], route)
        if (flag === true) {
          break
        }
      }
    }
    return flag
  } else {
    return true
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param menus
 */
function filterAsyncRouter(asyncRouterMap, menus) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(menus, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, menus)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: []
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
    }
  },
  actions: {
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { menus } = data
        commit('SET_ROUTERS', filterAsyncRouter(asyncRouterMap, menus))
        resolve()
      })
    }
  }
}

export default permission
