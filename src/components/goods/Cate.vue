<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <!-- 表格区 -->
      <tree-table class="TreeTable" :data="catelist" :columns="columns"
        :selection-type="false" :expand-type="false" show-index index-text="#" border
        :show-row-hover="false">
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-success" v-if="scope.row.cat_deleted===false"
            style="color:lightgreen;"></i>
          <i class="el-icon-error" v-else style="color:red;"></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level===0">一级</el-tag>
          <el-tag type="success" size="mini" v-else-if="scope.row.cat_level===1">二级
          </el-tag>
          <el-tag type="warning" size="mini" v-else> 三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">

          <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
          <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
        </template>

      </tree-table>

      <!-- 分页区 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum" :page-sizes="[3,5,10,15]"
        :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>

    <!-- 添加分类对话框 -->
    <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%"
      @close="addCateDialogClosed">
      <!-- 添加分类表单 -->
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef"
        label-width="100px">
        <el-form-item label="分类名称: " prop="cat_name">
          <el-input v-model="addCateForm.cat_name">
          </el-input>
        </el-form-item>
        <!-- 级联选择器 -->
        <!-- options指定数据源 -->
        <!-- props:value:指定属性值；table:标签属性；children：指选项属性值；disable:禁用选项属性值 -->
        <el-form-item label="父级分类名称: ">
          <el-cascader expandTrigger='hover' v-model="selectedKeys"
            :options="parentCateList" :props="cascaderProps" @change="parentCateChange"
            clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    name:'Cate',
    data(){
        return{
            //查询条件(分类数据条数请求 的请求参数)
            queryInfo:{
                type:3,
                pagenum:1,
                pagesize:5
            },

            //商品分类的数据列表，默认为空
            catelist:[],
            //总数据条数
            total:0,
            //为table指定列定义
            columns:[
              {
                label:'分类名称',
                prop:'cat_name'
              },
              {
                label:"是否有效",
                //表示，当前列定义为模板列
                type:"template",
                //表示当前列使用名称
                template:'isok'
              },
              {
                label:"排序",
                type:"template",
                template:"order"
                
              },{
                label:"操作",
                type:"template",
                template:"opt"
                
              }
            ],
            //控制分类对话框的显示与隐藏
            addCateDialogVisible:false,
            //添加表单的数据对象
            addCateForm:{
              //将要添加的分类名称
              cat_name:'',
              //父级分类的id
              cat_pid:'0',
              cat_level:0,
              //默认添加一级分类
              cat_level:0
            },
            //父级分类的列表
            parentCateList:[],

            //添加分类表单的验证规则对象
            addCateFormRules:{
              cat_name:[
                {required:true,message:"请输入分类名称",trigger:'blur'}
              ]
            },

            //指定级联选择器props配置
            cascaderProps:{
              value:'cat_id',
              label:'cat_name',
              children:'children'

            },
            //选中的父级分类的Id数组
            selectedKeys:[]
            
            

        }
    },
    created(){
        this.getCateList()

    },
    methods:{
        //获取商品分类数据
        async getCateList(){
            const {data:res}= await this.$http.get('categories',{params:this.queryInfo})
            if(res.meta.status!==200){
                return this.$message.error('获取商品数据失败！')
            }
            // console.log(res.data)
            //数据赋值到catelist
            this.catelist=res.data.result
            this.total=res.data.total
        },
        //监听pagesize改变
        handleSizeChange(newSize){
          this.queryInfo.pagesize=newSize
          this.getCateList()
        },
        //监听pagenum的改变
        handleCurrentChange(newPage){
          this.queryInfo.pagenum=newPage
          this.getCateList()
        },
        //点击按钮展示添加分类列表
        showAddCateDialog(){
          // 调用父级数据列表用于选项
          this.getParentCateList()
          this.addCateDialogVisible=true
        },
        //获得商品1、2级分类
        async getParentCateList(){
          const{data:res}=await this.$http.get('categories',{params:{type:2}})
          if(res.meta.status!==200){
                return this.$message.error('获取父级分类数据失败！')
            }
            console.log(res.data)
            this.parentCateList=res.data
        },
        //级联选择器选项变化
        parentCateChange(){
          console.log(this.selectedKeys)
          //如果selectKeys>0,则已选中父级分类
          if(this.selectedKeys.length>0){
            //父级等级设定
           this.addCateForm.cat_pid= this.selectedKeys[this.selectedKeys.length-1]
            this.addCateForm.cat_level=this.selectedKeys.length
            return
          }else{
            //父级分类的ID
            this.addCateForm.cat_pid=0
            //为当前分类的等级赋值
            this.addCateForm.cat_level=0
          }
        },
        //点击按钮添加新分类
        addCate(){
          // console.log(this.addCateForm)
          this.$refs.addCateFormRef.validate(async valid=>{
            if(!valid)return
            const{data:res}= await this.$http.post('categories',this.addCateForm)

            if(res.meta.status!==201){
              return this.$message.error("添加分类失败")

            }
            this.$message.success('添加分类成功')
            this.getCateList()
            this.addCateDialogVisible=false
          })
        },
        //监听对话框关闭事件，重置表单数据
        addCateDialogClosed(){
          this.$refs.addCateFormRef.resetFields()
          this.selectedKeys=[]
          this.addCateForm.cat_level=0
          this.addCateForm.cat_pid=0
        }
















        }



    


}
</script>

<style lang='less' scoped>
.TreeTable{
  margin-top: 10px;
}
.el-cascader{
  width: 100%;
}

</style>