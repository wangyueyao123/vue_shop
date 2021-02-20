<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告 -->
      <!-- 属性绑定要用： -->
      <el-alert title="注意：只允许为第三级分类设置相关参数" type="warning" show-icon :closable="false">
      </el-alert>
      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类:</span>
          <!-- 选择商品分类级联选择框 -->
          <el-cascader v-model="selectedCateKeys" :options="cateList"
            expandTrigger='hover' :props='cateProps' @change="handleChange">
          </el-cascader>
        </el-col>
      </el-row>

      <!-- table页签区 -->

      <el-tabs v-model="activeName" @tab-click="handleTabClick">

        <!-- 添加动态参数面板 -->
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isBtnDisable"
            @click="addDialogVisible=true">添加参数</el-button>
          <!-- 动态参数表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable
                  @close='handleClose(i,scope.row)'>
                  {{item}}
                </el-tag>
                <!-- 输入文本 -->
                <!-- 只在这里设置inputvisible和inputValue会导致所用的输入框共用状态 -->
                <!-- 要对每个item设定inputVisible和inputValue -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 输入按钮 -->
                <el-button v-else class="button-new-tag" size="small"
                  @click="showInput(scope.row)">+
                  New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="参数名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

        <!-- 添加静态态参数面板 -->
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isBtnDisable"
            @click="addDialogVisible=true">添加属性</el-button>
          <!-- 静态参数表格 -->
          <el-table :data="onlyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染标签 -->
                <el-tag v-for="(item,i) in scope.row.attr_vals" :key='i' closable
                  @close='handleClose(i,scope.row)'>
                  {{item}}
                </el-tag>
                <!-- 输入文本 -->
                <!-- 只在这里设置inputvisible和inputValue会导致所用的输入框共用状态 -->
                <!-- 要对每个item设定inputVisible和inputValue -->
                <el-input class="input-new-tag" v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue" ref="saveTagInput" size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)">
                </el-input>
                <!-- 输入按钮 -->
                <el-button v-else class="button-new-tag" size="small"
                  @click="showInput(scope.row)">+
                  New Tag</el-button>
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column label="属性名称" prop="attr_name"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit"
                  @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  @click="removeParams(scope.row.attr_id)">删除</el-button>

              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>

      </el-tabs>

    </el-card>

    <!-- 添加参数的对话框 -->
    <el-dialog :title="'添加'+titleText" :visible.sync="addDialogVisible" width="50%"
      @close="addDialogClosed">
      <!-- 添加参数对话框 -->
      <el-form ref="addFormRef" :model="addForm" :rules="addFormRules"
        label-width="100px">
        <!-- 验证规则时，prop和v-model属性名要一致 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数对话框 -->
    <el-dialog :title="'修改'+titleText" :visible.sync="editDialogVisible" width="50%"
      @close="editDialogClosed">
      <!-- 添加参数对话框 -->
      <el-form ref="editFormRef" :model="editForm" :rules="editFormRules"
        label-width="100px">
        <!-- 验证规则时，prop和v-model属性名要一致 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 删除参数提示框 -->

  </div>
</template>

<script>
export default {
    name:'Params',
    data(){
        return{
            //商品分类列表
            cateList:[],
            //级联选择框配置对象
            cateProps:{
                value:'cat_id',
                label:'cat_name',
                children:'children'

            },
            //级联选择框双向绑定数组
            selectedCateKeys:[],
            //被激活页签名称
            activeName:'many',
            // 动态参数数据
            manyTableData:[],
            //静态属性数据
            onlyTableData:[],
            //控件添加参数对话框可见
            addDialogVisible:false,
            //添加参数的表单数据对象
            addForm:{
              attr_name:''
            },
            //添加表单校验规则对象
            addFormRules:{
              attr_name:[{
                required:true,message:'请输入参数名称',trigger:"blur"
              }]
            },

            //控制修改对话框的显示
            editDialogVisible:false,
            //e修改表单数据对象
            editForm:{
             
            },
            //修改表单验证对象
            editFormRules:{
              attr_name:[{
                required:true,message:'请输入参数名称',trigger:"blur"
              }]
            },
          
            



            

        }
    },
    created(){
        this.getCateList()
    },
    methods:{
        //获取所用的商品分类
        async getCateList(){
            const{data:res}= await this.$http.get('categories')
            if(res.meta.status!==200){
              return this.$message.error("获取商品分类失败")
            }
            this.cateList=res.data
            // console.log(this.cateList)

        },

        //级联选择框选中项变化触发
         handleChange(){
             this.getParamsData()
            
        },

        //tab页签点击事件处理函数
        handleTabClick(){
            // console.log(this.activeName)
            this.getParamsData()
        },
        //获得参数的列表数据
        async getParamsData(){
            if(this.selectedCateKeys.length!==3){
                //选中的不是三级分类
                this.selectedCateKeys=[]
                this.manyTableData=[]
                this.onlyTableData=[]
                //  console.log(this.selectedCateKeys.length)
                return
            }
            //选中的是三级分类
            // console.log(this.selectedCateKeys.length)
            //根据所选ID及所处面板获得数据
            const{data:res}=await this.$http.get(`categories/${this.cateId}/attributes`,{
                params:{sel:this.activeName}
            })
            if(res.meta.status!==200){
              return this.$message.error("获取参数列表失败")}
            
            res.data.forEach(item=>{
              
              item.attr_vals=item.attr_vals?item.attr_vals.split(' '):[]
              // 控制文本框的显示与隐藏
              item.inputVisible=false
              //文本框中输入的值
              item.inputValue=''
            })

            console.log(res.data)
            if(this.activeName==='many'){
                this.manyTableData=res.data

            }else{
                this.onlyTableData=res.data
            }

        },
        //监听对话框关闭事件
        addDialogClosed(){
          this.$refs.addFormRef.resetFields()
        },
        //添加参数
        addParams(){
          this.$refs.addFormRef.validate(async valid=>{
            if(!valid) return
            const {data :res } = await this.$http.post(`categories/${this.cateId}/attributes`,{attr_name:this.addForm.attr_name,attr_sel:this.activeName})
          
                if(res.meta.status!==201){
              return this.$message.error("添加参数失败")}
              this.$message.success("添加参数成功")
              this.addDialogVisible=false
              this.getParamsData()
        })
        },
       async showEditDialog(attr_id){
          //查询当前参数的信息
          ///可以直接scope.row.xx得到值
          //表格作用域插槽的attr_name不一定真实（可能被改了），所以重新请求一次
          //get请求，请求体要写params
          const{data:res}= await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`,{params:{attr_sel:this.activeName}})
          if(res.meta.status!==200){
              return this.$message.error("获取参数信息失败")}
          this.editForm=res.data
          this.editDialogVisible=true

        },
        //重置修改对话框
        editDialogClosed(){
          this.$refs.editFormRef.resetFields()

        },
        //修改参数信息
        editParams(){
          this.$refs.editFormRef.validate(async valid=>{
            if(!valid)return
            const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`,{attr_name:this.editForm.attr_name,attr_sel:this.activeName})

            if(res.meta.status!==200){
              return this.$message.error("修改参数失败")
              }
            this.$message.success('修改参数成功')
            this.getParamsData()
            this.editDialogVisible=false
          })         

        },
        // 删除参数信息
       async removeParams(attr_id){
          const confirmResult=await this.$confirm('此操作将永久删除该参数, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
          }).catch(err=>err)
          if(confirmResult!=='confirm'){
            return this.$message.info('已取消删除')
          }

          const{data:res}= await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
          if(res.meta.status!==200){
            return this.$message.error("删除参数失败")
            }
        this.$message.success('删除参数信息成功！')
        this.getParamsData()
      },

      //文本框失去焦点或回车键触发按钮与输入框切换
       handleInputConfirm(row){
        if(row.inputValue.trim().length===0){
          row.inputValue=''
          row.inputValue=false
          return
        }
        //如果没有return，则证明输入的内容需要做后续处理
        row.attr_vals.push(row.inputValue.trim())
        row.inputVisible=false
        row.inputValue=''
        //发出请求，保存操作
        this.saveAttrvals(row)
        
        
      },
      // 保留对应参数attr_vals的修改上传
      async saveAttrvals(row){
        const{data:res}=await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
        {attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')})
        if(res.meta.status!==200){
          return this.$message.error('修改参数项失败！')
        }
        this.$message.success('修改参数项成功！')

      },

      //删除对应参数可选项
      handleClose(i,row){
        row.attr_vals.splice(i,1)
        this.saveAttrvals(row)
      },

      showInput(row){
         row.inputVisible=true
         //让文本框自动获取焦点
           //$nextTick方法，使用后，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
         this.$nextTick(_=>{         
           this.$refs.saveTagInput.$refs.input.focus()
         })
      },

      

      

        
        
        
        
    },
    computed:{
        //按钮需要禁用返回True
        isBtnDisable(){
            if(this.selectedCateKeys.length!==3){
                return true
            }
            return false 
        },
        //当前选中的三级分类的ID
        cateId(){
            if(this.selectedCateKeys.length===3){
                return this.selectedCateKeys[2]
            }
            return null 
        },
        //计算标题文本
        titleText(){
          if(this.activeName==="many")
          {
            return "动态参数"
          }
          return "静态属性"
        }
    }
    

}
</script>

<style lang="less" scope>
.cat_opt{
    margin:15px 0;
}
.el-tag{
  margin:10px;
}
.input-new-tag{
  width:100px !important;
  
}

</style>