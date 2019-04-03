import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

NProgress.configure({ showSpinner: false })// NProgress Configuration

// permissiom judge function
function hasPermission(authRules, permissionAuthRule) {
  if (!permissionAuthRule) return true
  let flag = false
  for (let i = 0; i < authRules.length; i++) {
    const authRule = authRules[i]['id'] + authRules[i]['app']
    if (authRule === permissionAuthRule) {
      flag = true
      break
    }
  }
  return flag
}

function getMenuAuthRuleId(menus, to_auth_rule) {
  for (var key in menus) {
    if (key === to_auth_rule) {
      return menus[key]['auth_rule_id']
    }
    if (menus[key]['items']) {
      const flag = getMenuAuthRuleId(menus[key]['items'], to_auth_rule)
      if (flag) return flag
    }
  }
}

const whiteList = ['/login'] // 不重定向白名单
router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.authRules.length === 0 && store.getters.isNullRules === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          const menus = res.data.menus
          store.dispatch('GenerateRoutes', { menus }).then(() => { // 根据menus权限生成可访问的路由表
            router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
            next({ ...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || 'Verification failed, please login again')
            next({ path: '/' })
          })
        })
      } else {
        // 没有动态改变权限的需求可直接next() 删除下方权限判断 ↓
        const menu_auth_rule_id = getMenuAuthRuleId(store.getters.menus, to.meta.auth_rule)
        if (hasPermission(store.getters.authRules, menu_auth_rule_id)) {
          next()//
        } else {
          next({ path: '/401', replace: true, query: { noGoBack: true }})
        }
        // 可删 ↑
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  NProgress.done() // 结束Progress
})
