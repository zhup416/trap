import Vue from 'vue'

import store from '../store'

const btnPermission = Vue.directive('btn-permission', {
  bind: function(el, binding, vnode) {
    let flag = false
    const authRules = store.getters.authRules
    for (let i = 0; i < authRules.length; i++) {
      if (authRules[i]['id'] === binding.value) {
        flag = true
      }
    }
    if (!flag) {
      el.style.display = 'none'
    }
  }
})

export default btnPermission
