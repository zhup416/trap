import Vue from 'vue'
import Router from 'vue-router'
const _import = require('./_import_' + process.env.NODE_ENV)

// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'
import EmptyPage from '../views/layout/EmptyPage'

/**
* hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
* alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
*                                if not set alwaysShow, only more than one route under the children
*                                it will becomes nested mode, otherwise not show the root menu
* redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
* name:'router-name'             the name is used by <keep-alive> (must set!!!)
* meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
**/
export const constantRouterMap = [
  { path: '/404', component: _import('errorPage/404'), hidden: true },
  { path: '/401', component: _import('errorPage/401'), hidden: true },
  { path: '/login', component: _import('login/index'), hidden: true },
  {
    path: '',
    component: Layout,
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: _import('dashboard/index'),
        name: 'dashboard',
        meta: { title: 'dashboard', icon: 'dashboard', noCache: true }
      }
    ]
  }
]

export default new Router({
  // mode: 'history', //后端支持可开
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/companyManage',
    component: EmptyPage,
    redirect: 'companyManage',
    meta: {
      title: 'companyManage',
      icon: 'netSpotManage',
      noCache: false
    },
    children: [
      {
        path: '/companyManage/company',
        component: Layout,
        name: 'companyManage',
        meta: {
          title: 'companyManage',
          noCache: false
        },
        children: [
          {
            path: 'index',
            component: _import('companyManage/company/index'),
            name: 'company',
            meta: {
              title: 'companyManage'
            }
          }
        ]
      },
      {
        path: '/companyManage/netSpotManage',
        component: Layout,
        redirect: 'noredirect',
        name: 'netSpotManages',
        meta: {
          title: 'netSpotManage'
        },
        children: [
          {
            path: 'netSpotManage',
            component: _import('companyManage/netSpotManage/index'),
            name: 'netSpotManage',
            meta: {
              title: 'netSpotManage'
            }
          },
          {
            path: 'netDetail',
            component: _import('companyManage/netSpotManage/netDetail/index'),
            name: 'netDetail',
            hidden: true,
            meta: {
              title: 'netDetail'
            }
          },
          {
            path: 'setSalesPerson',
            component: _import('companyManage/netSpotManage/setSalesPerson/index'),
            name: 'setSalesPerson',
            hidden: true,
            meta: {
              title: 'setSalesPerson'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/peopleManage',
    component: Layout,
    redirect: 'noredirect',
    name: 'peopleManage',
    meta: {
      title: 'peopleManage',
      icon: 'peopleManage',
      noCache: false
    },
    children: [
      {
        path: 'salesPersonManage',
        component: _import('peopleManage/salesPersonManage/index'),
        name: 'salesPersonManage',
        meta: {
          title: 'salesPersonManage',
          noCache: false
        }
      },
      {
        path: 'professionManage',
        component: _import('peopleManage/professionManage/index'),
        name: 'professionManage',
        meta: {
          title: 'professionManage',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/customerManage',
    component: Layout,
    redirect: 'customerManage',
    meta: {
      title: 'customerManage',
      icon: 'customerManage',
      noCache: false
    },
    children: [
      {
        path: 'personalManage',
        component: _import('customerManage/personalManage/index'),
        name: 'personalManage',
        meta: {
          title: 'personalManage',
          noCache: false
        }
      },
      {
        path: 'enterpriseManage',
        component: _import('customerManage/enterpriseManage/index'),
        name: 'enterpriseManage',
        meta: {
          title: 'enterpriseManage',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/customerManage/customerDetail',
    component: Layout,
    hidden: true,
    redirect: 'customerDetail',
    meta: {
      title: 'customerDetail'
    },
    children: [
      {
        path: 'customerDetail',
        component: _import('customerManage/customerDetail/index'),
        name: 'customerDetail',
        meta: {
          title: 'customerDetail'
        }
      }
    ]
  },
  {
    path: '/productManage',
    component: Layout,
    redirect: 'productManage',
    meta: {
      title: 'productManage',
      icon: 'productManage',
      noCache: false
    },
    children: [
      {
        path: 'classifyManage',
        component: _import('productManage/classifyManage/index'),
        name: 'classifyManage',
        meta: {
          title: 'classifyManage',
          noCache: false
        }
      },
      {
        path: 'product',
        component: _import('productManage/product/index'),
        name: 'product',
        meta: {
          title: 'product',
          noCache: false
        }
      },
      {
        path: 'addProduct',
        component: _import('productManage/product/addProduct'),
        name: 'addProduct',
        hidden: true,
        meta: {
          title: 'addProduct',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/orderManage',
    component: Layout,
    redirect: 'orderManage',
    meta: {
      title: 'orderManage',
      icon: 'orderManage',
      noCache: false
    },
    children: [
      {
        path: 'unAudited',
        component: _import('orderManage/unAudited/index'),
        name: 'unAudited',
        meta: {
          title: 'unAudited',
          noCache: false
        }
      }, {
        path: 'audited',
        component: _import('orderManage/audited/index'),
        name: 'audited',
        meta: {
          title: 'audited',
          noCache: false
        }
      }, {
        path: 'expireSoon',
        component: _import('orderManage/expireSoon/index'),
        name: 'expireSoon',
        meta: {
          title: 'expireSoon',
          noCache: false
        }
      }, {
        path: 'expire',
        component: _import('orderManage/expire/index'),
        name: 'expire',
        meta: {
          title: 'expire',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/orderManage/orderDetail',
    component: Layout,
    hidden: true,
    redirect: 'orderDetail',
    meta: {
      title: 'orderDetail'
    },
    children: [
      {
        path: 'orderDetail',
        component: _import('orderManage/orderDetail/index'),
        name: 'orderDetail',
        meta: {
          title: 'orderDetail'
        }
      }
    ]
  },
  {
    path: '/financeManage',
    component: Layout,
    redirect: 'financeManage',
    meta: {
      title: 'financeManage',
      icon: 'financeManage',
      noCache: false
    },
    children: [
      {
        path: 'receivables',
        component: _import('financeManage/receivables/index'),
        name: 'receivables',
        meta: {
          title: 'receivables',
          noCache: false
        }
      },
      {
        path: 'cash',
        component: _import('financeManage/cash/index'),
        name: 'cash',
        meta: {
          title: 'cash',
          noCache: false
        }
      },
      {
        path: 'commissionRecord',
        component: _import('financeManage/commissionRecord/index'),
        name: 'commissionRecord',
        meta: {
          title: 'commissionRecord',
          noCache: false
        }
      }

    ]
  },
  // {
  //   path: '/saleToolManage',
  //   component: Layout,
  //   redirect: 'saleToolManage',
  //   meta: {
  //     title: 'saleToolManage',
  //     icon: 'saleToolManage',
  //     noCache: false
  //   },
  //   children: [
  //     {
  //       path: 'healthReport',
  //       component: _import('saleToolManage/healthReport/index'),
  //       name: 'healthReport',
  //       meta: {
  //         title: 'healthReport',
  //         noCache: false
  //       }
  //     },
  //     {
  //       path: 'healthReport',
  //       component: _import('saleToolManage/healthReport/index'),
  //       name: 'healthReport',
  //       meta: {
  //         title: 'healthReport',
  //         noCache: false
  //       }
  //     }
  //   ]
  // },
  {
    path: '/saleToolManage',
    component: EmptyPage,
    redirect: 'saleTool',
    meta: {
      title: 'saleToolManage',
      icon: 'saleToolManage',
      noCache: false
    },
    children: [{
      path: '/saleToolManage/healthReport',
      component: Layout,
      name: 'healthReport',
      meta: {
        title: 'saleToolManage',
        noCache: false
      },
      children: [{
        path: 'index',
        component: _import('saleToolManage/healthReport/index'),
        name: 'healthIndex',
        meta: {
          title: 'healthReport'
        }
      },
      {
        path:'addReport',
        component:_import('saleToolManage/healthReport/addReport'),
        name:'addReport',
        hidden:true,
        meta:{
          title:'addReport'
        }
      },
      {
        path:'reports',
        component:_import('saleToolManage/healthReport/reports'),
        name:'reports',
        hidden:true,
        meta:{
          title:'reports'
        }
      }
    ]
    }]
  },
  {
    path: '/platformManage',
    component: Layout,
    redirect: 'platformManage',
    meta: {
      title: 'platformManage',
      icon: 'platformManage',
      noCache: false
    },
    children: [
      {
        path: 'slideGroup',
        component: _import('platformManage/slideGroup/index'),
        name: 'slideGroup',
        meta: {
          title: 'slideGroup',
          noCache: false
        }
      },
      {
        path: 'adPicture',
        component: _import('platformManage/adPicture/index'),
        name: 'adPicture',
        meta: {
          title: 'adPicture',
          noCache: false
        }
      },
      {
        path: 'platformSet',
        component: _import('platformManage/platformSet/index'),
        name: 'platformSet',
        meta: {
          title: 'platformSet',
          noCache: false
        }
      }
    ]
  },
  // {
  //   path: '/tagManage',
  //   component: Layout,
  //   redirect: 'tagManage',
  //   meta: {
  //     title: 'tagManage',
  //     icon: 'tagManage',
  //     noCache: false
  //   },
  //   children: [
  //     {
  //       path: 'tagGroup',
  //       component: _import('tagManage/tagGroup/index'),
  //       name: 'tagGroup',
  //       meta: {
  //         title: 'tagGroup',
  //         noCache: false
  //       }
  //     },
  //     {
  //       path: 'tagGroup',
  //       component: _import('tagManage/tagGroup/index'),
  //       name: 'tagGroup',
  //       meta: {
  //         title: 'tagGroup',
  //         noCache: false
  //       }
  //     }
  //   ]
  // },
  {
    path: '/tagManage',
    component: Layout,
    redirect: 'tagManage',
    meta: {
      title: 'tagManage',
      noCache: false
    },
    children: [{
      path: 'tagGroup',
      component: _import('tagManage/tagGroup/index'),
      name: 'tagGroup',
      meta: {
        title: 'tagManage',
        icon: 'tagManage',
        noCache: false
      }
    }]
  },
  // {
  //   path: '/tagManage/addTag',
  //   component: Layout,
  //   hidden: true,
  //   redirect: 'noredirect',
  //   meta: {
  //     title: 'addTag',
  //     noCache: false
  //   },
  //   children: [
  //     {
  //       path: 'addTag',
  //       component: _import('tagManage/addTag/index'),
  //       name: 'addTag',
  //       meta: {
  //         title: 'addTag',
  //         noCache: false
  //       }
  //     }
  //   ]
  // },
  {
    path: '/menuManagement',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    meta: {
      title: 'menuManagement',
      noCache: false
    },
    children: [
      {
        path: 'menuManagement',
        component: _import('menuManagement/index'),
        name: 'menuManagement',
        meta: {
          title: 'menuManagement',
          noCache: false
        }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: 'noredirect',
    name: 'setting',
    meta: {
      title: 'setting',
      icon: 'example',
      auth_rule: '6admin'
    },
    children: [
      {
        path: 'mailerSetting',
        component: _import('setting/mailer/index'),
        name: 'mailerSetting',
        meta: {
          title: 'mailerSetting',
          auth_rule: '15admin'
        }
      },
      {
        path: 'websiteInformation',
        component: _import('setting/websiteInformation/index'),
        name: 'websiteInformation',
        meta: {
          title: 'websiteInformation',
          auth_rule: '71admin'
        }
      },
      {
        path: 'slideManagement',
        component: _import('setting/slideManagement/index'),
        name: 'slideManagement',
        meta: {
          title: 'slideManagement',
          auth_rule: '78admin'
        }
      },
      {
        path: 'pluginManagement',
        component: _import('setting/pluginManagement/index'),
        name: 'pluginManagement',
        meta: {
          title: 'pluginManagement',
          auth_rule: ''
        }
      },
      {
        path: 'uploadSetting',
        component: _import('setting/uploadSetting/index'),
        name: 'uploadSetting',
        meta: {
          title: 'uploadSetting',
          auth_rule: '75admin'
        }
      },
      {
        path: 'fileStorage',
        component: _import('setting/fileStorage/index'),
        name: 'fileStorage',
        meta: {
          title: 'fileStorage',
          auth_rule: '93admin'
        }
      }
    ]
  },
  {
    path: '/userManagement',
    component: EmptyPage,
    redirect: 'noredirect',
    name: 'userManagement',
    meta: {
      title: 'userManagement',
      icon: 'peoples',
      auth_rule: '109user'
    },
    children: [
      {
        path: '/userManagement/managementGroup',
        component: Layout,
        redirect: 'noredirect',
        name: 'managementGroup',
        meta: {
          title: 'managementGroup',
          auth_rule: '49admin'
        },
        children: [
          {
            path: 'roleManagement',
            component: _import('userManagement/managementGroup/roleManagement/index'),
            name: 'roleManagement',
            meta: {
              title: 'roleManagement',
              auth_rule: '50admin'
            }
          },
          {
            path: 'administrator',
            id: '110admin',
            component: _import('userManagement/managementGroup/administrator/index'),
            name: 'administrator',
            meta: {
              title: 'administrator',
              auth_rule: '110admin'
            }
          }
        ]
      },
      {
        path: '/userManagement/userGroup',
        component: Layout,
        redirect: 'noredirect',
        name: 'userGroup',
        meta: {
          title: 'userGroup'
          // auth_rule: '152user'
        },
        children: [
          {
            path: 'thisSiteUser',
            component: _import('userManagement/userGroup/thisSiteUser/index'),
            name: 'thisSiteUser',
            meta: {
              title: 'thisSiteUser'
              // auth_rule: '153user'
            }
          },
          {
            path: 'theThirdUser',
            component: _import('userManagement/userGroup/theThirdUser/index'),
            name: 'theThirdUser',
            meta: {
              title: 'theThirdUser'
              // auth_rule: '156user'
            }
          }
        ]
      }
    ]
  },
  {
    path: '/resourceManagement',
    component: Layout,
    hidden: true,
    children: [
      {
        path: 'index',
        name: 'resourceManagement',
        component: _import('resourceManagement/index'),
        meta: {
          title: 'resourceManagement',
          icon: 'file',
          noCache: true
          // auth_rule: '150user'
        }
      }
    ]
  },
  {
    path: '/userInfo',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [
      {
        path: 'modifyInfo',
        component: _import('userInfo/modifyInfo'),
        name: 'modifyInfo',
        meta: { title: 'modifyInfo', noCache: true }
      },
      {
        path: 'changePwd',
        component: _import('userInfo/changePwd'),
        name: 'changePwd',
        meta: { title: 'changePwd', noCache: true }
      }
    ]
  },
  {
    path: '/error',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    name: 'errorPages',
    meta: {
      title: 'errorPages',
      icon: '404'
    },
    children: [
      { path: '401', component: _import('errorPage/401'), name: 'page401', meta: { title: 'page401', noCache: true }},
      { path: '404', component: _import('errorPage/404'), name: 'page404', meta: { title: 'page404', noCache: true }}
    ]
  },
  {
    path: '/error-log',
    component: Layout,
    hidden: true,
    redirect: 'noredirect',
    children: [{ path: 'log', component: _import('errorLog/index'), name: 'errorLog', meta: { title: 'errorLog', icon: 'bug' }}]
  },
  { path: '*', redirect: '/404', hidden: true }
]

