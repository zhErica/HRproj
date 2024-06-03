<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini" @click="showDialog = true"
          >添加角色</el-button
        >
      </div>
      <!-- 放置表格 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200px" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input
              v-if="row.isEdit"
              v-model="row.editRow.name"
              size="mini"
            ></el-input>
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <!-- s设置开关的值 开 1 关 0 -->
            <el-switch
              v-if="row.isEdit"
              v-model="row.editRow.state"
              :active-value="1"
              :inactive-value="0"
            ></el-switch>
            <span v-else>{{
              row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input
              size="mini"
              v-if="row.isEdit"
              type="textarea"
              v-model="row.editRow.description"
            ></el-input>
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 -->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!--  编辑状态 -->
              <el-button size="mini" type="primary" @click="btnEditOK(row)">确定</el-button>
              <el-button size="mini" @click="row.isEdit = false">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button type="text" size="mini">分配权限</el-button>
              <el-button type="text" size="mini" @click="btnEditRow(row)">编辑</el-button>
              <el-popconfirm title="确定删除当前角色吗？" @onConfirm="confirmDel(row.id)">
                <el-button style="margin-left: 10px;" type="text" size="mini" slot="reference">删除</el-button>
              </el-popconfirm>
            </template>
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
          @current-change="changePage"
        >
        </el-pagination>
      </el-row>
    </div>
    <!-- 放置弹层 -->
    <el-dialog
      title="新增弹层"
      :visible.sync="showDialog"
      @close="btnCancel"
      width="500px"
    >
      <!-- 表单内容 -->
      <el-form
        ref="roleForm"
        label-width="120px"
        :model="roleForm"
        :rules="rules"
      >
        <el-form-item prop="name" label="角色名称">
          <el-input
            v-model="roleForm.name"
            style="width: 300px"
            size="mini"
          ></el-input>
        </el-form-item>
        <el-form-item label="启用" prop="state">
          <!-- 如果不需要校验，就不用写prop属性  但是重置表单时 需要将数据恢复初始值状态就又需要prop属性-->
          <el-switch
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
          ></el-switch>
        </el-form-item>
        <el-form-item prop="description" label="角色描述">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            style="width: 300px"
            size="mini"
          ></el-input>
          <!-- :rows="3" 设置文本域为3行 -->
        </el-form-item>
        <!-- 确认与取消按钮 -->
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button @click="btnOK" size="mini" type="primary"
                >确认</el-button
              >
              <el-button @click="btnCancel" size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getRoleList, addRole, updateRole, delRole } from "@/api/role";
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
      roleForm: {
        name: "",
        description: "",
        state: 0, //默认未启用状态 关闭是0 打开是1
      },
      // 弹层表单校验
      rules: {
        name: [
          {
            required: true,
            message: "角色名称不能为空",
            trigger: "blur",
          },
        ],
        description: [
          {
            required: true,
            message: "角色描述不能为空",
            trigger: "blur",
          },
        ],
      },
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
      // 针对每一行 添加一个编辑的标记
      this.list.forEach((item) => {
        // item.isEdit = false // 添加一个属性
        // 数据响应式问题 数据变化 视图更新
        // 添加的动态属性 不具备响应式特点
        // this.$set(目标对象，属性名称，初始值) 可以对目标对象添加属性 添加响应式
        this.$set(item, "isEdit", false);
        this.$set(item, "editRow", {
          name: item.name,
          description: item.description,
          state: item.state,
        });
      });
    },
    // 切换分页时 请求新的数据
    changePage(newPage) {
      this.pageParams.page = newPage; // 赋值当前页码
      this.getRoleList();
    },
    // 确认与取消按钮
    btnOK() {
      this.$refs.roleForm.validate(async (isOK) => {
        if (isOK) {
          await addRole(this.roleForm);
          this.$message.success("确定新增角色成功");
          this.getRoleList();
          this.btnCancel();
        }
      });
    },
    btnCancel() {
      this.$refs.roleForm.resetFields(); // 重置表单数据
      this.showDialog = false; // 关闭弹层
    },
    // 点击编辑行
    btnEditRow(row) {
      row.isEdit = true; //改变行的编辑状态
      // 更新缓存数据
      row.editRow.name = row.name;
      row.editRow.state = row.state;
      row.editRow.description = row.description;
    },
    // 点击确定时触发
    async btnEditOK(row) {
      if (row.editRow.name && row.editRow.description) {
        // 下一步操作
        await updateRole({ ...row.editRow, id: row.id });
        // 更新成功
        this.$message.success("更新角色成功");
        // 更新显示数据 退出编辑状态
        // Object.assign(target,source)   合并对象
        Object.assign(row, {
          ...row.editRow,
          isEdit: false, // 退出编辑模式
        });
        // row.name = row.editRow.name
        // row.state = row.editRow.state
        // row.description = row.editRow.description
        // row.isEdit= false
      } else {
        this.$message.warning("角色和名字不能为空");
      }
    },

    async confirmDel(id){
      await delRole(id)
      this.$message.success("删除成功")
      // 删除的如果是最后一个
      if(this.list.length === 1) this.pageParams.page--
      // 重新加载数据
      this.getRoleList()
    }
  },
};
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
