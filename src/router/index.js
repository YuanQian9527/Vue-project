import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 * 做权限的话 需要做动态路由 
 * 常量路由: constantRoutes 不需要权限默认展示的路由 登陆,首页,404等
 * 异步路由: asyncRoutes
 * 任意路由: anyRouters 404
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '首页', icon: 'dashboard' }
    }]
  },

]
export const asyncRoutes = [
  //异步理由:不同的用户（角色），需要过滤筛选出的路由，称之为异步路由
  //有的用户可以看见测试管理、有的看不见
  //权限管理
  {
    name: 'Acl',
    path: '/acl',
    component: Layout,
    redirect: '/acl/user/list',
    meta: {
      title: '权限管理',
      icon: 'el-icon-lock'
    },
    children: [
      {
        name: 'User',
        path: 'user/list',
        component: () => import('@/views/acl/user/list'),
        meta: {
          title: '用户管理',
        },
      },
      {
        name: 'Role',
        path: 'role/list',
        component: () => import('@/views/acl/role/list'),
        meta: {
          title: '角色管理',
        },
      },
      {
        name: 'RoleAuth',
        path: 'role/auth/:id',
        component: () => import('@/views/acl/role/roleAuth'),
        meta: {
          activeMenu: '/acl/role/list',
          title: '角色授权',
        },
        hidden: true,
      },
      {
        name: 'Permission',
        path: 'permission/list',
        component: () => import('@/views/acl/permission/list'),
        meta: {
          title: '菜单管理',
        },
      },
    ]
  },
  //商品管理
  {
    path: "/product",
    component: Layout,
    name: "Product",
    meta: { title: '会议管理', icon: 'el-icon-goods' },
    children: [
      {
        path: "tradeMark",
        name: "TradeMark",
        component: () => import("@/views/product/tradeMark"),
        meta: { title: '议题管理' }
      },
      {
        path: "attr",
        name: "Attr",
        component: () => import("@/views/product/Attr"),
        meta: { title: '平台属性管理' }
      },
      {
        path: "spu",
        name: "Spu",
        component: () => import("@/views/product/Spu"),
        meta: { title: 'spu管理' }
      },
      {
        path: "sku",
        name: "Sku",
        component: () => import("@/views/product/Sku"),
        meta: { title: 'sku管理' }
      },
    ]
  },
]
// 404 page must be placed at the end !!!
//任意路由
export const anyRouters = [
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
