<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom: 10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree
          ref="deptTree"
          node-key="id"
          :data="depts"
          :props="defaultProps"
          default-expand-all
          :expand-on-click-node="false"
          :highlight-current="true"
          @current-change="selectNode"
        >
        </el-tree>
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{ row }">
              <el-avatar
                v-if="row.staffPhoto"
                :src="row.staffPhoto"
                :size="30"
              ></el-avatar>
              <span v-else class="username">{{ row.username.charAt(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="username" label="姓名" align="center"></el-table-column>
          <el-table-column
            prop="mobile"
            label="手机号"
            width="120px"
            sortable
            align="center"
          ></el-table-column>
          <el-table-column
            prop="workNumber"
            label="工号"
            width="120px"
            sortable
            align="center"
          ></el-table-column>
          <el-table-column prop="formOfEmployment" label="聘用形式" align="center">
            <template v-slot="{ row }">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" align="center"></el-table-column>
          <el-table-column
            prop="timeOfEntry"
            label="入职时间"
            width="120px"
            sortable
          ></el-table-column>
          <el-table-column label="操作" width="240px" align="center">
            <template v-slot="{row}">
              <el-button type="text" size="mini" @click="$router.push(`/employee/detail/${row.id}`)">查看</el-button>
              <el-button type="text" size="mini" @click="btnRole(row.id)">角色</el-button>
              <!-- 删除员工数据--气泡确认框 -->
              <el-popconfirm 
              title="确定删除该员工数据吗？" 
              @onConfirm="confirmDel(row.id)">
                <el-button style="margin-left: 10px;" type="text" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-row align="middle" style="height: 60px" type="flex" justify="end">
          <!-- : 是属性 @ 是事件 -->
          <el-pagination
            layout="total,prev, pager, next"
            :total="total"
            :current-page="queryParams.page"
            :page-size="queryParams.pagesize"
            @current-change="changePage"
          >
          </el-pagination>
        </el-row>
      </div>
    </div>
    <!-- 放置导入组件 -->
    <import-excel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList"></import-excel>
    <el-dialog :visible.sync='showRoleDialog' title="分配角色">
      <!-- 弹层内容 -->
      <!-- checkbox -->
      <el-checkbox-group v-model="roleIds">
        <!-- 放置n个checkbox  要指定checkbox的存储值item.id-->
        <el-checkbox v-for="item in roleList" :label="item.id" :key="item.id">{{ item.name }}</el-checkbox>
      </el-checkbox-group>
      <!-- 确定和取消按钮 -->
      <!-- 使用具名插槽： slot="footer" -->
      <el-row slot="footer" type="flex" justify="center">
        <el-col :span="6">
          <el-button size="mini" type="primary" @click="btnRoleOK">确定</el-button>
          <el-button size="mini" @click="showRoleDialog=false">取消</el-button>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import { getDepartment } from "@/api/department";
import { transListToTreeData } from "@/utils";
import { getEmployeeList,exportEmployee,delEmployee,getEnableRoleList,getEmployeeDetail,assignRole } from "@/api/employee";
import FileSaver from "file-saver";
import ImportExcel from './components/import-excel.vue';
export default {
  name: "Employee",
  components:{
    ImportExcel
  },
  data() {
    return {
      depts: [], // 组织数据
      defaultProps: {
        label: "name",
        children: "children",
      },
      // 存储查询参数
      queryParams: {
        departmentId: null,
        page: 1, // 当前页码
        pagesize: 10,
        keyword: "",
      },
      total: 0, //记录员工的总数
      list: [], //存储员工列表数据
      showExcelDialog:false, //控制excel弹层的显示和隐藏
      showRoleDialog:false,// 控制角色弹层的显示与隐藏
      roleList:[], // 接收角色列表
      roleIds:[], // 用来双向绑定数据
      currentUserId:null,  //用来记录当前点击的id、
    };
  },
  created() {
    this.getDepartment();
  },
  methods: {
    async getDepartment() {
      // 调用api接口
      // 递归方法 将列表转化为树形
      this.depts = transListToTreeData(await getDepartment(), 0);
      this.queryParams.departmentId = this.depts[0].id;
      // 设置选中节点
      //树组件渲染是异步的 等到更新完毕
      this.$nextTick(() => {
        // 此时意味着树渲染完毕
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId);
      });
      // 此时 参数记录了id
      this.getEmployeeList();
    },
    selectNode(node) {
      this.queryParams.departmentId = node.id; // 重新记录了参数
      this.queryParams.page = 1; // 设置为第一页
      this.getEmployeeList(); // 重新加载数据
    },
    // 封装获取员工列表的方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams);
      this.list = rows;
      this.total = total;
    },
    // 切换页码事件
    changePage(newPage) {
      this.queryParams.page = newPage; // 赋值新页码
      this.getEmployeeList(); //查询数据
    },
    changeValue() {
      // this.queryParams.page = 1;
      // this.getEmployeeList();
      // 防抖： 单位时间内只执行最后一次
      // this的实例上赋值了一个timer属性
      clearTimeout(this.timer)  // 清理上一次的定时器
      this.timer = setTimeout(() => {
        this.queryParams.page = 1;
        this.getEmployeeList();
      }, 500);
    },
    async exportEmployee(){
      const result = await exportEmployee()  // 导出所有员工接口
      console.log(result);
      // FileSaver.saveAs(blob对象，文件名称)
      FileSaver.saveAs(result,'员工信息表.xlsx')  // 下载文件
    },
    // 删除员工
    async confirmDel(id){
      await delEmployee(id)
      this.$message.success("删除成功")
      // 判断删除的是不是最后一个
      if(this.list.length === 1 && this.queryParams.page > 1) this.pageParams.page--
      // 重新加载数据
      this.getEmployeeList()
    },
    // 点击角色按钮弹出层
    async btnRole(id){      
      this.roleList= await getEnableRoleList()
      //记录当前点击的id 因为后边确定取消要存取给对应的用户 
      this.currentUserId = id     
      const {roleIds} = await getEmployeeDetail(id)
      this.roleIds = roleIds
      this.showRoleDialog=true
    },
    // 点击角色的确定
    async btnRoleOK(){
      await assignRole({
        id:this.currentUserId,
        roleIds:this.roleIds
      })
      this.$message.success('分配用户角色成功')
      this.showRoleDialog=false
    }
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin: 10px;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04c9be;
      font-size: 12px;
      display: inline-block;
    }
  }
}
</style>
