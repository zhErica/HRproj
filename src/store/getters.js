const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  userId: state => state.user.userInfo.userId,
  avatar: state => state.user.userInfo.staffPhoto, // 向外暴露头像
  name: state => state.user.userInfo.username,  //向外暴露用户名称
  company:state =>state.user.userInfo.company, //向外暴露公司名称
  departmentName: state =>state.user.userInfo.departmentName,
  routes:state => state.user.routes //路由
}
export default getters
