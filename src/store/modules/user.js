import {getToken,setToken,removeToken} from '@/utils/auth'
import {login,getUserInfo} from '@/api/user'

const state ={
  token:getToken(), //从缓存中读取初始值
  userInfo:{} // 存储用户基本资料状态
}
const mutations = {
  setToken(state,token){
    state.token = token
    // 同步到缓存
    setToken(token)
  },
  removeToken(){
    // 删除vuex中的token
    state.token = null
    removeToken()
  },
  // 更改用户资料
  setUserInfo(state,userInfo){
    state.userInfo = userInfo
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
  }
}

export default{
  namespaced:true, // 开启命名空间
  state,
  mutations,
  actions
}