<template>
  <el-container class="manage-container">
    <el-header height="80px">
      <span>精诚模型项目后台管理系统</span>
      <span class="el-header-r">
        欢迎您，{{username}}，
        <a @click="logout">退出</a>
      </span>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          background-color="#303133"
          text-color="#FFFFFF"
          active-text-color="#ffd04b"
          :default-active="$route.path"
          router
        >
          <el-menu-item index="/admin/manage/project">项目管理</el-menu-item>
          <el-menu-item index="/admin/manage/application">立项申请</el-menu-item>
          <el-menu-item index="/admin/manage/maintain">项目维护</el-menu-item>
          <el-menu-item index="/admin/manage/remote">远程服务平台</el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  computed: {
    username() {
      return JSON.parse(sessionStorage.getItem("jcmx-userinfo")).username;
    }
  },
  methods: {
    logout() {
      sessionStorage.removeItem("jcmx-userinfo", "");
      this.$router.replace("/admin/login");
    }
  }
};
</script>

<style scoped>
.manage-container {
  height: 100%;
}
.el-header {
  display: flex;
  justify-content: space-between;
  line-height: 80px;
  font-size: 20px;
  font-weight: bold;
  color: #ffffff;
  background-color: #409eff;
}

.el-aside {
  background-color: #303133;
  color: #333;
  text-align: center;
}

.el-main {
  color: #333;
  text-align: center;
  height: 100%;
}

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}

.el-header-r {
  font-size: 16px;
  font-weight: normal;
}

.el-header-r > a {
  cursor: pointer;
}

.el-header-r > a:hover {
  text-decoration: underline;
}
</style>
