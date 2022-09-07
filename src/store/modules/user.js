import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, anyRouters, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'
import cloneDeep from 'lodash/cloneDeep'
const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],//菜单权限
    buttons: [],//按钮权限
    roles: [],//角色权限
    //服务器返回的路由和现有路由的对比数组
    resAsyncRouters: [],
    //最终展示路由
    allAsyncRouters: [],
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_RESASYNCROUTERS: (state, resAsyncRouters) => {
    state.resAsyncRouters = resAsyncRouters
    state.allAsyncRouters = constantRoutes.concat(state.resAsyncRouters, anyRouters)
    //给路由器添加新的路由
    router.addRoutes(state.allAsyncRouters)
  },
  // SET_NAME: (state, name) => {
  //   state.name = name
  // },
  // SET_AVATAR: (state, avatar) => {
  //   state.avatar = avatar
  // },
  //储存用户信息
  SET_USERINFO: (state, userinfo) => {
    state.name = userinfo.name
    state.avatar = userinfo.avatar
    //菜单权限
    state.routes = userinfo.routes
    //按钮权限
    state.buttons = userinfo.buttons
    //角色权限
    state.roles = userinfo.roles
  }
}
//计算比较异步路由
const computedRes = (asyncRoutes, routes) => {
  console.log(1,asyncRoutes)
  console.log(2,routes)
  //过滤当前用户的权限展示的异步路由
  return asyncRoutes.filter(item => {
    // console.log(item)
    //后端返回的数组中如果没有这个元素返回值是-1 //routes 这里routes是个对象数组 
    if (routes.includes(item.name)) {
      //递归 可能有二级,三级路由
      if (item.children && item.children.length) {
        item.children = computedRes(item.children, routes)
      }
      return true
    }
  })
  // // 数组克隆成对象
  // return function clone(arr) {
  //   var obj = {};
  //   for (var key in arr) {
  //     obj[key] = arr[key]
  //   }
  //   return obj;
  // }
}
const actions = {
  // user login 处理登录
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    // return new Promise((resolve, reject) => {
    //   login({ username: username.trim(), password: password }).then(response => {
    //     const { data } = response
    //     commit('SET_TOKEN', data.token)
    //     setToken(data.token)
    //     resolve()
    //   }).catch(error => {
    //     reject(error)
    //   })
    // })
    let res = await login({ username: username.trim(), password: password })
    console.log(res)
    if (res.code == 20000) {
      commit('SET_TOKEN', res.data.token)
      setToken(res.data.token)
    } else {
      Promise.reject(new Error("faile"))
    }

  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data)
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        // const { name, avatar } = data
        // commit('SET_NAME', name)
        // commit('SET_AVATAR', avatar)
        commit('SET_USERINFO', data)
        commit('SET_RESASYNCROUTERS', computedRes(cloneDeep(asyncRoutes), data.routes))
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

