<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form
          ref="userForm"
          :model="userInfo"
          :rules="rules"
          label-width="220px"
        >
          <!-- 姓名 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input
                  v-model="userInfo.username"
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input
                  size="mini"
                  v-model="userInfo.workNumber"
                  class="inputW"
                  disabled
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <el-input
                  :disabled="!!$route.params.id"  
                  v-model="userInfo.mobile"
                  size="mini"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <!-- inputW样式会给到selectTree 中template第一层的组件 -->
                <select-tree class="inputW" v-model="userInfo.departmentId"></select-tree>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 聘用形式 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select
                  v-model="userInfo.formOfEmployment"
                  size="mini"
                  class="inputW"
                >
                  <el-option label="正式" value="1"></el-option>
                  <el-option label="非正式" value="2"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 转正时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker
                  v-model="userInfo.correctionTime"
                  size="mini"
                  type="date"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <image-upload v-model="userInfo.staffPhoto"></image-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="mini" type="primary" @click="saveData"
                >保存更新</el-button
              >
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>
 <script>
import SelectTree from "./components/select-tree.vue";
import {addEmployee,getEmployeeDetail,updateEmployee} from '@/api/employee'
import ImageUpload from './components/image-upload.vue'
export default {
  components: { SelectTree,ImageUpload },
  data() {
    return {
      userInfo: {
        username: "", // 用户名
        mobile: "", // 手机号
        workNumber: "", // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: "", // 入职时间
        correctionTime: "", // 转正时间
        staffPhoto:''
      },
      rules: {
        username: [
          { required: true, message: "请输入姓名", trigger: "blur" },
          {
            min: 1,
            max: 6,
            message: "姓名为1-6位",
          },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/,
            message: "手机号格式不正确",
            trigger: "blur",
          },
        ],
        formOfEmployment: [
          { required: true, message: "请选择聘用形式", trigger: "blur" },
        ],
        departmentId: [
          { required: true, message: "请选择部门", trigger: "blur" },
        ],
        timeOfEntry: [
          { required: true, message: "请选择入职时间", trigger: "blur" },
        ],
        correctionTime: [
          { required: true, message: "请选择转正时间", trigger: "blur" },
          {
            validator: (rule, value, callback) => {
              if (this.userInfo.timeOfEntry) {
                if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                  callback(new Error("转正时间不能小于入职时间"));
                  return;
                }
              }
              callback();
            },
          },
        ],
      },
    };
  },
  created(){
    //如何获取路由参数中的id
    // console.log(this.$route.params.id);
    if (this.$route.params.id) {this.getEmployeeDetail()}  // if判断
    // this.$route.params.id && getEmployeeDetail()  // 逻辑运算
  },
  methods: {
    async getEmployeeDetail(){
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    },
    saveData() {
      this.$refs.userForm.validate(async isOK =>{
        if(isOK){
          // 判断当前是否为编辑模式
          if(this.$route.params.id){
            // 编辑模式
            await updateEmployee(this.userInfo)
            this.$message.success('更新员工成功')
          }else{
            // 新增模式
            await addEmployee(this.userInfo)
            this.$message.success('新增员工成功')
          }
          this.$router.push('/employee')
        }
      });
    },
  },

};
</script>
  
  <style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
</style>