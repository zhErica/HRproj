<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input
              v-model="loginForm.mobile"
              placeholder="请输入手机号"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input show-password v-model="loginForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width: 350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === "development" ? "13800000002" : '',
        password: process.env.NODE_ENV === "development" ? "hm#qd@23!" : '',
        isAgree:process.env.NODE_ENV === "development"

      },
      loginRules: {
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            // 验证触发的时机：失去焦点时触发
            trigger: 'blur',
          },
          {
            // 正则表达式：
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: 'blur',
          },
          {
            min:6,
            max:16,
            message:"密码长度应该在6-16之间",
            trigger:"blur",
          }
        ],
        // required 只能检测 null undefined "" 不能检测布尔值
        isAgree: [{
          // 自定义校验规则
          validator:(rule,value,callback) => {
            // rule：检验规则
            // value：检验的值
            // callback：函数 --（相当于）promise resolve reject
            // callback() callback(new Error(错误信息))
            value ? callback() : callback(new Error('您必须勾选用户协议'))
          }
        }],
      },
    };
  },
  methods:{
    login(){
      this.$refs.form.validate(async(isOK)=>{
        if(isOK){
          await this.$store.dispatch("user/login",this.loginForm)
          // vuex中action返回的promise
          //跳转主页
          this.$router.push('/')
        }
      })
    },
  }
};
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color: #606266;
    }
  }
}
</style>
