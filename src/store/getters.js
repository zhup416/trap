const getters = {
  sidebar: state => state.app.sidebar,
  language: state => state.app.language,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  authRules: state => state.user.authRules,
  menus: state => state.user.menus,
  isNullRules: state => state.user.isNullRules,
  cachedViews: state => state.tagsView.cachedViews,
  permission_routers: state => state.permission.routers,
  addRouters: state => state.permission.addRouters,
  errorLogs: state => state.errorLog.logs
}

export default getters
