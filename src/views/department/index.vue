<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree default-expand-all :data="depts" :props="defaultProps" :expand-on-click-node="false">
        <!-- 节点结构 -->
        <!-- 作用域插槽 v-slot="{node, data}" 只能作用在template -->
        <template v-slot="{data}">
          <el-row
            style="width: 100%; height: 40px"
            type="flex"
            justify="space-between"
            align="middle"
          >
            <el-col>{{data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{data.managerName}}</span>
              <!-- $event 实参 表示类型 -->
              <el-dropdown @command="operateDept($event,data.id)" trigger="click">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link">
                  操作<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>
      </el-tree>
    </div>
    <!-- 放置弹层组件 -->
    <!-- .sync表示会接收子组件的事件 update:showDialog, 值 赋给属性 
    sync 修饰符表示双向绑定。它允许子组件在需要时改变这个值，并将改变传回父组件-->
    <add-dept ref="addDept" @updateDepartment="getDepartment" :current-node-id="currentNodeId" :showDialog.sync="showDialog"/> 
    <!--  ref="addDept" 为 <add-dept> 组件设置了一个引用名称 addDept。 -->
  </div>
</template>

<script>
import {getDepartment,delDepartment} from '@/api/department'
import {transListToTreeData } from '@/utils'
import AddDept from './components/add-dept.vue'
export default {
  name: "Department",
  components:{AddDept},
  data() {
    return {
      currentNodeId:null, //存储当前部门的id
      showDialog:false,// 控制弹层的显示与隐藏
      depts: [], //数据属性
      defaultProps: {
        label: "name", //要显示的字段名称
        children: "children", // 读取子节点的字段名
      },
    };
  },
  created(){
    this.getDepartment() //调用获取数据接口
  },
  methods:{
    // 封装好一个方法
    async getDepartment(){
        const result = await getDepartment()
        this.depts =transListToTreeData(result,0) 
    },
    // 操作部门的方法
    operateDept(type,id){
      if (type === 'add'){
        //添加子部门
        this.showDialog =true //显示弹层组件
        this.currentNodeId = id
      }else if(type === 'edit'){
        //编辑部门场景
        this.showDialog = true
        this.currentNodeId = id  // 记录id 后要用它获取数据
        // 更新props --异步动作
        // 直接调用子组件的方法 同步的方法
        // 要在子组件获取数据 
        // 父组件调用子组件获取数据--- ref 可以获取dom的实例对象 也可以获取自定义组件的实例对象
        this.$nextTick(()=>{
          this.$refs.addDept.getDepartmentDetail()    //this.$refs.addDept等同于子组件的this
        })
      }else{
        // 删除部门
        this.$confirm("您确定要删除该部门吗？").then(async()=>{
          await delDepartment(id)
          // 提示消息
          this.$message.success("删除部门成功")
          this.getDepartment()
        })
      }
    }
  }
};
</script>

<style scoped>
.app-container {
  padding: 30px 140px;
  font-size: 14px;
}
.tree-manager {
  width: 50px;
  display: inline-block;
  margin-right: 25px;
}
</style>