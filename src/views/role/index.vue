<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true">添加角色</el-button>
      </div>
      <!-- 放置表格 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column
          prop="name"
          align="center"
          width="200px"
          label="角色"
        ></el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <span>{{
              row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="description"
          align="center"
          label="描述"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template>
            <el-button type="text" size="mini">分配权限</el-button>
            <el-button type="text" size="mini">编辑</el-button>
            <el-button type="text" size="mini">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="end" style="height: 60px" align="middle">
        <!-- 放置分页组件 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :current-page="pageParams.page"
          :total="pageParams.total"
          layout="prev,pager,next"
          @current-change = "changePage"
        >
        </el-pagination>
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog title="新增弹层" :visible.sync ='showDialog' @close="btnCancel" width="500px">
      <!-- 表单内容 -->
      <el-form ref="roleForm" label-width="120px" :model="roleForm" :rules="rules">
        <el-form-item prop="name" label="角色名称">
          <el-input v-model="roleForm.name" style="width: 300px;" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <!-- 如果不需要校验，就不用写prop属性  但是重置表单时 需要将数据恢复初始值状态就又需要prop属性-->
          <el-switch v-model="roleForm.state" :active-value="1" :inactive-value="0"></el-switch>
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input v-model="roleForm.description" type="textarea" :rows="3" style="width: 300px;" size="mini"></el-input>  
          <!-- :rows="3" 设置文本域为3行 -->
        </el-form-item>
        <!-- 确认与取消按钮 -->
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button @click="btnOK" size="mini" type="primary">确认</el-button>
              <el-button @click="btnCancel" size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole } from "@/api/role";
export default {
  name: "Role",
  data() {
    return {
      list: [],
      // 控制弹层的显示与隐藏
      showDialog: false,
      // 将分页信息放入一个对象中 便于管理
      pageParams: {
        page: 1, //第几页
        pagesize: 5, // 每页多少条
        total: 0,
      },
      // 弹层表单
      roleForm:{
        name:'',
        description:'',
        state:0, //默认未启用状态 关闭是0 打开是1
      },
      // 弹层表单校验
      rules:{
        name:[{
          required:true,message:'角色名称不能为空',trigger:'blur'
        }],
        description:[{
          required:true,message:'角色描述不能为空',trigger:'blur'
        }]
      }
    };
  },
  created() {
    this.getRoleList();
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams);
      this.list = rows; // 赋值数据
      this.pageParams.total = total;
    },
    // 切换分页时 请求新的数据
    changePage(newPage){
      this.pageParams.page = newPage // 赋值当前页码
      this.getRoleList()
    },
    // 确认与取消按钮
    btnOK(){
      this.$refs.roleForm.validate(async isOK=>{
        if(isOK){
          await addRole(this.roleForm)
          this.$message.success('确定新增角色成功')
          this.getRoleList()
          this.btnCancel()
        }
      })
    },
    btnCancel(){
      this.$refs.roleForm.resetFields()  // 重置表单数据
      this.showDialog = false // 关闭弹层
    }
  },
};
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
