<template>
  <div class="container">
    <div class="app-container">
      <el-button class="btn-add" size="mini" type="primary"  @click="showDialog = true">添加权限</el-button>
      <!-- 表格 -->
      <el-table :data="list" row-key="id" default-expand-all>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column prop="code" label="标识"></el-table-column>
        <el-table-column prop="description" label="描述"></el-table-column>
        <el-table-column label="操作">
          <template v-slot="{ row }">
            <el-button v-if="row.type === 1" type="text" size="mini"
              >添加</el-button>
            <el-button type="text" size="mini">编辑</el-button>
            <el-popconfirm title="确定删除当前权限吗？" @onConfirm="confirmDel(row.id)">
                <el-button style="margin-left: 10px;" type="text" size="mini" slot="reference">删除</el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!-- 弹层 -->
    <el-dialog
      title="新增权限"
      :visible.sync="showDialog"
      width="500px">
      <el-form label-width="120px">
        <el-form-item label="权限名称">
          <el-input style="width:300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="权限标识">
          <el-input style="width:300px" size="mini"></el-input>
        </el-form-item>
        <el-form-item label="权限描述">
          <el-input style="width:300px" size="mini" :rows="2" type="textarea"></el-input>
        </el-form-item>
        <el-form-item label="开启" >
          <el-switch></el-switch>
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col  :span="12">
              <el-button size="mini" type="primary" >确定</el-button>
              <el-button size="mini">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
import { getPermissionList,delPermission } from "@/api/permission";
import { transListToTreeData } from "@/utils/index";
export default {
  name: "Permission",
  data() {
    return {
      showDialog:false, //控制弹层显示与隐藏
      list: [],
    };
  },
  created() {
    this.getPermissionList();
  },
  methods: {
    async getPermissionList() {
      this.list = transListToTreeData(await getPermissionList(), 0); //将列表数据转换成树形
    },

    // 删除
    async confirmDel(id){
      await delPermission(id)
      this.$message.success("删除成功")
      // 判断删除的是不是最后一个
      if(this.list.length === 1) this.pageParams.page--
      // 重新加载数据
      this.getPermissionList()
    }
  },
};
</script>
<style scoped>
.btn-add {
  margin: 10px;
}
</style>
