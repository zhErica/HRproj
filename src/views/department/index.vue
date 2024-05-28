<template>
  <div class="container">
    <div class="app-container">
      <!-- 展示树形结构 -->
      <el-tree default-expand-all :data="depts" :props="defaulProps" :expand-on-click-node="false">
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
              <el-dropdown @command="operateDept($event,data.id)">
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
    <add-dept @updateDepartment="getDepartment" :current-node-id="currentNodeId" :showDialog.sync="showDialog"/>
  </div>
</template>

<script>
import {getDepartment} from '@/api/department'
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
      defaulProps: {
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