<template>
  <!-- 搜索 -->
  <el-form :inline="true" style="margin-left:20px;">
    <el-form-item label="项目名称">
      <el-input v-model="projectName" placeholder="项目名称" @keyup.enter.native="searchProject"></el-input>
    </el-form-item>
    <el-form-item label="业务员">
      <el-input v-model="salesman" placeholder="业务员" @keyup.enter.native="searchProject"></el-input>
    </el-form-item>
    <el-form-item label="项目状态">
      <el-select v-model="state" placeholder="项目状态" style="width:120px;">
        <el-option label="全部" value></el-option>
        <el-option label="未验收" value="0"></el-option>
        <el-option label="已验收" value="1"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchProject">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapActions, mapMutations } = createNamespacedHelpers("projectModule");
export default {
  data() {
    return {
      projectName: "",
      salesman: "",
      state: ""
    };
  },
  methods: {
    ...mapMutations(["setSearch", "setCurrentPage"]),
    ...mapActions(["getProjectList"]),
    searchProject() {
      let { projectName, salesman, state } = this,
        search = {};
      if (projectName) {
        search.projectName = projectName;
      }
      if (state) {
        search.state = state;
      }
      if (salesman) {
        search.salesman = salesman;
      }
      this.setSearch(search);
      this.setCurrentPage(1);
      this.getProjectList();
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 150px;
}
</style>
