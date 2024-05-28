<template>
  <el-dialog title="新增部门" @close="close" :visible="showDialog">
    <!-- 放置弹层内容 -->
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input
          v-model="formData.name"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input
          v-model="formData.code"
          placeholder="2-10个字符"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item prop="managerId" label="部门负责人">
        <el-select
          v-model="formData.managerId"
          placeholder="请选择负责人"
          style="width: 80%"
          size="mini"
        />
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input
          v-model="formData.introduce"
          placeholder="1-100个字符"
          type="textarea"
          size="mini"
          :rows="4"
          style="width: 80%"
        />
      </el-form-item>
      <el-form-item>
        <!-- 按钮部分 -->
        <el-row type="flex" justify="center">
          <!-- :span="12"：设置列的跨度（宽度），使用 24 栅格系统中的 12 栅格。这意味着这一列将占据容器宽度的一半（50%）。 -->
          <el-col :span="12">
            <el-button size="mini" type="primary">确定</el-button>
            <el-button size="mini">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
import {getDepartment} from '@/api/department'
export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      formData: {
        code: "", // 部门编码
        introduce: "", //部门介绍
        managerId: "", //部门负责人id
        name: "", // 部门名称
        pid: "", //父级部门的id
      },
      rules: {
        code: [
          { required: true, message: "部门编码不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门编码的长度为2-10",
            trigger: "blur",
          },{
            trigger:'blur',
            // 自定义校验
            validator:async(rule,value,callback)=>{
                //value就是输入的编码
                const result = await getDepartment()
                // result 数组中是否存在value值
                if(result.some(item => item.code===value)){
                    callback(new Error('部门中已存在该编码'))
                }
            }
          }
        ], // 部门编码
        introduce: [
          { required: true, message: "部门介绍不能为空", trigger: "blur" },
          {
            min: 1,
            max: 100,
            message: "部门介绍的长度为1-100",
            trigger: "blur",
          },
        ], //部门介绍
        managerId: [
          { required: true, message: "部门负责人不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门负责人的长度为2-10",
            trigger: "blur",
          },
        ], //部门负责人id
        name: [
          { required: true, message: "部门名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "部门名称的长度为2-10",
            trigger: "blur",
          },,{
            trigger:'blur',
            // 自定义校验
            validator:async(rule,value,callback)=>{
                //value就是输入的编码
                const result = await getDepartment()
                // result 数组中是否存在value值
                if(result.some(item => item.name===value)){
                    callback(new Error('部门中已存在该名称'))
                }
            }
          }
        ], // 部门名称
        // pid:'', // 不需要校验
      },
    };
  },
  methods: {
    close() {
      //修改父组件的值 子传父
      this.$emit("update:showDialog", false);
    },
  },
};
</script>

<style>
</style>