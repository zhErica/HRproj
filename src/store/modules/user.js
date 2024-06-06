import {getToken,setToken,removeToken} from '@/utils/auth'
import {login,getUserInfo} from '@/api/user'
import {constantRoutes} from '@/router'

const state ={
  token:getToken(), //从缓存中读取初始值
  userInfo:{}, // 存储用户基本资料状态
  routes:constantRoutes,//静态路由的数组
}
const mutations = {
  setToken(state,token){
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  removeToken(state){
    // 删除vuex中的token
    state.token = null
    removeToken()
  },
  // 更改用户资料
  setUserInfo(state,userInfo){
    state.userInfo = userInfo
  },
  // 路由
  setRoutes(state,newRoutes){
    state.routes = [...constantRoutes,...newRoutes] //静态路由+动态路由
  }
}
const actions= {
  // 第一个参数：context上下文，第二个参数：传入参数
  async login(context,data){
    console.log(data);
    // todo:调用登录接口
    const token = await login(data)
    // 返回一个token 123456
    context.commit("setToken",token)
  },
  // 获取用户基本资料
  async getUserInfo(context){
    const result = await getUserInfo()
    context.commit("setUserInfo",result)
    return result 
  },
  //退出登录的action
  logout(context){
    // 触发名为 removeToken 的 mutation，用于清除 token
    context.commit("removeToken")  // 删除token
    //  触发名为 setUserInfo 的 mutation，并传递一个空对象 {}，用于清除用户信息。
    context.commit("setUserInfo",{}) //设置用户信息为空对象即删除用户信息
  }
}

export default{
  namespaced:true, // 开启命名空间
  state,
  mutations,
  actions
}