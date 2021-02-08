<template>
  <div>
    <!-- 面包屑导航区 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图 -->
    <el-card>
      <!-- 添加角色按钮区 -->
      <el-row>
        <el-col>
          <el-button type="primary">
            添加角色
          </el-button>
        </el-col>
      </el-row>
      <!-- 角色列表区 -->
      <el-table :data="roleList" border stripe>
        <!-- 展开行 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <!-- i1是数组每列的序号index -->
            <el-row :class="['bdbottom', i1===0 ? 'bdtop' :'','vcenter']"
              v-for="(item1,i1) in scope.row.children" :key="item1.id">

              <!-- 渲染一级权限 占5列 -->
              <el-col :span="5">
                <el-tag closable @close="removeRightById( scope.row,item1.id)">
                  {{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二、三级权限 占19列 -->
              <el-col :span="19">
                <!-- 通过for循环 嵌套渲染二级权限 -->
                <el-row :class="[i2===0? '':'bdtop','vcenter']"
                  v-for="(item2,i2) in item1.children" :key="item2.id">
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable
                      @close="removeRightById( scope.row,item2.id)"> {{item2.authName}}
                    </el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>

                  <!-- 三级权限 -->
                  <el-col :span="18">
                    <el-tag v-for="(item3,i3) in item2.children" :key="item3.id"
                      type="warning" closable
                      @close="removeRightById( scope.row,item3.id)">
                      {{item3.authName}}
                    </el-tag>
                  </el-col>
                </el-row>

              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <!-- 索引列 -->
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" width="400px">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" size="mini"
              @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 提示框 -->
    <!-- //展示分配权限的对话框 -->
    <el-dialog title="分配权限" :visible.sync="SetRightDialogVisible" width="50%"
      @close="setRightDialogClosed">
      <!-- 树形控件 props 指定数据字段  label指定文本名称-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id"
        default-expand-all :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="SetRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRights ">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  data() {
    return {
      // 所用角色列表数据
      roleList  : [],
      //分配权限的对话框显示或隐藏
      SetRightDialogVisible:false,
      //所用权限数值
      rightsList:[],
      //树形控件属性绑定对象
      treeProps:{
        label:'authName',
        children:'children'
        //children实现父子节点嵌套
      },
      //默认选中节点ID数值
      defKeys:[],
      //当前即将分配权限的id
      roleId:[],


    }
  },
  created() {
    this.getRolesList()
  },
  methods: {
    //   获取所用角色列表
    async getRolesList() {
      const { data: res } = await this.$http.get('roles')
      if (res.meta.status !== 200) { return this.$message.error('获取用户列表失败') }
      this.roleList = res.data

      console.log(this.roleList)
    },

    // 根据ID删除对应权限
    async removeRightById(role, rightId) {
      // 弹窗提示是否删除
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== "confirm") {
        return this.$message.info("取消了删除")

      }
      //   请求路径：roles/:roleId/rights/:rightId
      // 注意，此处为反引号引用``
      const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
      if (res.meta.status !== 200) { return this.$message.error('删除权限失败') }

      //   this.getRolesList()
      //这样写折叠行不会折叠
      role.children = res.data
    },



    //展示分配权限的对话框
    async showSetRightDialog(role){
      this.roleId=role.id
      const { data: res } = await this.$http.get('rights/tree') 
      if (res.meta.status !== 200) { return this.$message.error('获取权限失败') }
      this.rightsList=res.data
      // console.log(this.rightsList)
      //递归获取三级权限
      this.getLeafKeys(role,this.defKeys)
      this.SetRightDialogVisible=true

    },
    //通过递归的形式，获取角色下所有三级权限的id并保存到defKeys数组中
    getLeafKeys(node,arr){
      //如果当前node节点不含children属性，则是三级节点
      if(!node.children ){
        return arr.push(node.id)
      }
        node.children.forEach(item => this.getLeafKeys(item,arr))
        
      
    },
    //监听分配权限对话框的关闭事件
    async setRightDialogClosed(){
      this.defKeys=[]
    },
    //为角色分配权限
    async allotRights(){
      ///...展开运算符
      const keys=[
      ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys)
      const idStr =keys.join(',')
      const {data:res} = await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})

       if (res.meta.status !== 200) { return this.$message.error('分配权限失败') }
       this.$message.success('分配权限成功')
       this.getRolesList()
       this.SetRightDialogVisible=false
    }

  }
      
    

}
</script>

<style lang="less" scoped>
.el-tag{
    margin:8px;
}
.bdtop{
    border-top: 1px solid #eee;
}
.bdbottom{
    border-bottom: 1px solid #eee;
}
// 纵向居中对齐
.vcenter{
    display: flex;
    align-items: center;
}
</style>