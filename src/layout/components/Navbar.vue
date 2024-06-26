<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 显示头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span class="username" v-else>{{ name?.charAt(2) }}</span>
          <!-- 显示用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item>
              首页
            </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/zhErica/HRproj.git">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- 用修饰符prevent阻止默认事件 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native是事件的修饰符 -->
          <!-- 注册组件的根元素的原生事件（h5） -->
          <el-dropdown-item @click.native="logout">
            <span style="display:block;">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 放置dialog -->
    <!-- sync修饰符 可以接收子组件传过来的事件和值 -->
    <el-dialog width="500px" title="修改密码" @close="btnCancel" :visible.sync="showDialog">
      <!-- 放置表单 -->
      <!-- // ref：获取整个表单实例对象 -->
      <el-form ref="passForm" label-width="120px"  :model="passForm" :rules="rules">   
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passForm.oldPassword" show-password size="small"/>
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small"/>
        </el-form-item>
        <el-form-item label="重复密码" prop="confirmPassword">
          <el-input v-model="passForm.confirmPassword" show-password size="small"/>
        </el-form-item>
        <el-form-item>
          <el-button @click="btnOK" size="mini" type="primary">确认修改</el-button>
          <el-button @click="btnCancel" size="mini">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword} from '@/api/user'
import { Upload } from 'element-ui';

export default {
  data(){
    return {
      showDialog:false, //用来控制弹层的显示与隐藏
      passForm:{
        oldPassword:'', //旧密码
        newPassword:'', //新密码
        confirmPassword:'' // 确认密码
      },
      // 表单校验的规则
      rules:{
        oldPassword:[{required:true,message:'旧密码不能为空', trigger:'blur'}],
        newPassword:[{required:true,message:'新密码不能为空', trigger:'blur'},{
          trigger:'blur',
          min:6,
          max:16,
          message:'新密码长度为6-16位之间'
        }
        ],
        confirmPassword:[{required:true,message:'重复密码不能为空', trigger:'blur'},{
          trigger:'blur',
          // 自定义规则 
          // 需要用箭头函数才能取到this是组件实例？？？？？·
          validator:(rule,value,callback)=>{
            if(this.passForm.newPassword === value){
              callback()
            }else{
              callback(new Error('重复密码和新密码输入不一致'))
            }
          }
        }]
      }
    }
  },
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    // 引入头像和用户名称
    ...mapGetters([
      'sidebar',
      'avatar',
      'name'
    ])
  },
  methods: {
    updatePassword(){
      // 弹出层
      this.showDialog = true //显示弹层
    },
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 直接调用退出登陆的action
      await this.$store.dispatch('user/logout')
      this.$router.push("/login")
    },
    // 确定按钮
    btnOK(){
      this.$refs.passForm.validate(async isOK=>{
        if(isOK){
          // 调用接口
          await updatePassword(this.passForm)
          this.$message.success("修改密码成功")
          this.btnCancel()
          // // 成功了
          // this.$refs.passForm.resetFields() //重置表单
          // // 关闭弹层
          // this.showDialog = false
        }
      })
    },
    // 取消按钮
    btnCancel(){
      this.$refs.passForm.resetFields() //重置表单
      // 关闭弹层
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;

        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }
        .name{
          cursor: pointer;
          margin-right: 10px;
          font-size: 16px;
        }
        .username{
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be;
          color: #fff;
          font-size: 18px;
          border-radius: 50%;
          margin-right: 4px;
        }
        .el-icon-setting{
          cursor: pointer;
          font-size: 20px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
