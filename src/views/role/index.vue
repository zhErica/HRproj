<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button type="primary" size="mini">添加角色</el-button>
      </div>
      <!-- 放置表格 -->
      <el-table :data="list">
        <!-- 放置列 -->
        <el-table-column prop="name" align="center" width="200px" label="角色"></el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{row}">
            <span>{{ row.state === 1 ? '已启用' : row.state === 0 ? '未启用' : '无' }}</span> 
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述"></el-table-column>
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
      <el-row type="flex" justify="end" style="height: 60px;" align="middle">
      <!-- 放置分页组件 -->
      <el-pagination layout="prev,pager,next">
      </el-pagination>
      </el-row>
    </div>
  </div>
</template>
<script>
import {getRoleList} from '@/api/role'
export default {
  name: 'Role',
  data(){
    return {
      list:[]
    }
  },
  created(){
    this.getRoleList()
  },
  methods:{
    async getRoleList(){
      const {rows} = await getRoleList()
      this.list = rows   // 赋值数据
    }
  }
}
</script>
<style scoped>
.role-operate{
  padding: 10px;
}
</style>
