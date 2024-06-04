<template>
  <!-- element-ui 级联选择器 -->
  <el-cascader :value="value" size="mini" :options="treeData" :props="props" separator="-"
  @change="changeValue">

  </el-cascader>
</template>

<script>
import {getDepartment} from '@/api/department'
import {transListToTreeData} from '@/utils'
export default {
    props:{
        value:{
            type:Number, // 存储的是部门的id
            default:null
        }
    },

    data(){
        return {
            treeData:[], // 赋值给级联组件的options
            props:{
                label:'name',  // 要展示的字段
                value:'id', // 要存储的字段
            }
        }
    },
    created(){
        this.getDepartment()
    },
    methods:{
        async getDepartment(){
            this.treeData =transListToTreeData(await getDepartment(),0) // 将组织架构的数据 转化树形赋值给treeData          
        },
        changeValue(list){
            // 取数组最后一位
            if(list.length > 0){
                this.$emit('input',list[list.length-1])  //将最后一位id取出来 传出去(select-tree组件v-model 数据)
            }else{
                this.$emit("input",null)  // 如果长度为0 说明值为空 
            }
        }
    }
}
</script>
