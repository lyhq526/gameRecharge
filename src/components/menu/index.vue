<template>
  <div class="body-menu">
    <el-menu
      :default-active="activePath"
      @select="changMenu"
      text-color="#ffffff"
      :default-openeds="['video','pan']"
      background-color="#494949"
    >
      <el-menu-item index="/home">
        <i class="iconfont iconwode"></i>
        <span slot="title">我的</span>
      </el-menu-item>
      <el-submenu index="video">
        <template slot="title">
          <i class="iconfont iconshipin"></i>
          <span>腾讯视频签到</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/tentVideo">
            <i class="iconfont icontianjiazengjiajia"></i>
            <span slot="title">添加签到</span>
          </el-menu-item>
          <el-menu-item index="/tentVideo/tutorial">
            <i class="iconfont iconjiaocheng"></i>
            <span slot="title">签到教程</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
      <el-submenu index="pan">
        <template slot="title">
          <i class="iconfont iconwangpan"></i>
          <span>天翼云盘签到</span>
        </template>
        <el-menu-item-group>
          <el-menu-item index="/netdisc">
            <i class="iconfont icontianjiazengjiajia"></i>
            <span slot="title">添加签到</span>
          </el-menu-item>
          <el-menu-item index="/netdisc/tutorial">
            <i class="iconfont iconjiaocheng"></i>
            <span slot="title">签到教程</span>
          </el-menu-item>
        </el-menu-item-group>
      </el-submenu>
    </el-menu>
  </div>
</template>
<script>
export default {
  data() {
    return {
      activePath: "/home"
    };
  },
  methods: {
    changMenu(val) {
      if (this.activePath == val) return;
      this.$router.push({ path: val });
    }
  },
  mounted() {
    this.activePath = this.$route.path;
  },
  watch: {
    $route(val) {
      this.activePath = val.path;
    }
  }
};
</script>
<style scoped lang="scss">
.body-menu {
  .el-menu-item-group {
    .is-active {
      background: #3a3a3a !important;
      color: #e7b962 !important;
      i {
        color: #e7b962 !important;
      }
      span {
        color: #e7b962 !important;
      }
      // border-left: 3px solid #e7b962;
      &:hover {
        background: #3a3a3a !important;
      }
    }
  }

  .el-menu-item {
    padding: 0 20px !important;
    min-width: 0;
  }
  .el-menu-item:hover {
    background: transparent;
  }
  .el-menu {
    background: #494949;
    i {
      color: #ffffff;
    }
  }

  i {
    font-size: 16px;
    margin-right: 4px;
  }
}
</style>