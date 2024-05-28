<template>
  <el-dialog title="新增部门" @close="close" :visible="showDialog">
    <!-- 放置弹层内容 -->
    <el-form label-width="120px">
        <el-form-item label="部门名称">
            <el-input placeholder="2-10个字符" style="width: 80%;" size="mini"/>
        </el-form-item>
        <el-form-item label="部门编码">
            <el-input placeholder="2-10个字符" style="width: 80%;" size="mini"/>
        </el-form-item>
        <el-form-item label="部门负责人">
            <el-select placeholder="2-10个字符" style="width: 80%;" size="mini"/>
        </el-form-item>
        <el-form-item label="部门介绍">
            <el-input placeholder="1-100个字符" type="textarea" size="mini" :rows="4" style="width: 80%;"/>
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
export default {
    props:{
        showDialog:{
            type:Boolean,
            default:false
        }
    },
    methods:{
        close(){
            //修改父组件的值 子传父
            this.$emit("update:showDialog",false)
        }
    }
}
</script>

<style>

</style>