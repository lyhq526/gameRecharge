<template>
  <el-container class="main">
    <el-aside width="170px">
      <bodyMenu></bodyMenu>
    </el-aside>
    <el-container>
      <el-header>
        <bodyHead></bodyHead>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
import bodyMenu from "../components/menu/index";
import bodyHead from "../components/head";
export default {
  components: { bodyMenu, bodyHead }
};
</script>
<style lang="scss">
.main {
  height: 100vh;
  .el-header {
    padding: 0;
  }
  .el-menu{
    border: 0;
  }
  .el-aside {
    border-right: 1px solid #e6e6e6;
    background: #494949;
  }
}
</style>
