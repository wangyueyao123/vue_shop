<template>
  <el-container class="home-container">
    <!-- 头部区 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="">
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <div class="toggle-button" @click="toggleCollapse"><i
            :class="isCollapse?'el-icon-d-arrow-right':'el-icon-d-arrow-left'"> </i></div>
        <!-- 侧边栏菜单区 -->
        <!-- unique-open一排只能开一个二级菜单布尔值，写上即为true。或者用:绑定值true/false -->
        <!-- collapse折叠 collapse-transition取消折叠动画-->
        <!-- router 开路由模式 跳转到index -->
        <!-- default-active 所赋值选项高亮  -->
        <el-menu background-color="#333744" text-color="#fff" active-text-color="#409BFF"
          unique-opened :collapse="isCollapse" :collapse-transition="false" router
          :default-active="activePath">
          <!-- 一级菜单 -->
          <!-- 如果index相同，那么多个菜单同步。所以，每个菜单应该有独属index -->
          <!-- index 转换为字符串 -->
          <el-submenu :index="item.id+'' " v-for="item in menuList" :key="item.id">
            <!-- 一级菜单模板区 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class=iconsObj[item.id]></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- index是router跳转页路径名 -->
            <el-menu-item :index="'/'+subItem.path" v-for="subItem in item.children"
              :key="subItem.id" @click="saveNavState('/'+subItem.path )">
              <!-- 二级菜单文本 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>

        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>

</template>

<script>
export default {
  name:'Home',
  data(){
   
    return{ 
      //左侧菜单数据
      menuList:[],
      iconsObj:{
        '125':'el-icon-user-solid',
        '103':'el-icon-s-check',
        '101':'el-icon-s-shop',
        '102':'el-icon-s-order',
        '145':'el-icon-s-data',

      },
      // 是否折叠
      isCollapse:false,
      activePath:''

    }
  },
  //生命周期开始时，执行行为，导入左侧菜单
  created(){
    this.getMenuList()
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      //退出功能
      //清空token值
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    //获取所用菜单
    async getMenuList(){
      //this.$http=axios,见main.js文档。请求路径是menus
      const {data:res} =await this.$http.get('menus')
      //判断请求是否成功
      if(res.meta.status!==200)return this.$message.error(res.meta.msg)
      //赋值
      this.menuList=res.data
      // console.log(res)

    },
    // 点击按钮，切换菜单折叠与展开
    toggleCollapse(){
      this.isCollapse=!this.isCollapse
    },
    //保存链接激活状态, 和token 保存在 window.sessionStorage中
    saveNavState(activePath){
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
    

  },
};
</script>

<style lang="less" scoped>
.home-container{
  height:100%;
}
.el-header{
  background-color: #373D41;
  display: flex;
  justify-content: space-between;
    // space-between：两端对齐，项目之间间隔相等；
  padding-left: 0;
  align-items: center;
  // center：中点对齐
  color: #fff;
  font-size:20px;
  > div{
    // E>F:子选择符：选择所有作为E元素的子元素F
    display: flex;
    align-items: center;
    //居中对齐
    span{
      margin-left: 15px;
    }
  }

}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #EAEDF1;
}
.el-menu{
  border-right: none;
}
.toggle-button{
  background-color: #4A5064;
  font-size: 20px;
  line-height: 24px;
  color:#fff;
  text-align: center;
  letter-spacing:0.2em;
  cursor: pointer;

}
</style>