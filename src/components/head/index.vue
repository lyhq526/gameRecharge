<template>
  <div class="body-head">
    <el-dropdown trigger="click"  @command="handleClick">
      <span style=" cursor: pointer;">
        {{userName}}
        <i class="el-icon-arrow-down el-icon--right"></i>
      </span>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item command="quit">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </div>
</template>
<script>
export default {
  data() {
    return {};
  },
  computed: {
    userName() {
      return JSON.parse(localStorage.getItem("userInfo")).userName;
    }
  },
  methods:{
      handleClick(a){
          if(a=='quit'){
              sessionStorage.removeItem("token");
              this.$router.push({path:'/login'})
          }
      },
  },
};
</script>
<style  lang="scss">
.body-head {
  padding: 0 40px;
  text-align: right;
  line-height: 60px;
  border-bottom: 1px solid #e6e6e6;
}
</style>