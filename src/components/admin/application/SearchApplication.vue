<template>
  <!-- 搜索 -->
  <el-form :inline="true" style="margin:0 auto 0 20px;min-width:720px;">
    <el-form-item label="项目名">
      <el-input v-model="projectName" placeholder="项目名" @keyup.enter.native="searchApplication"></el-input>
    </el-form-item>
    <el-form-item label="业务员">
      <el-input v-model="salesman" placeholder="业务员" @keyup.enter.native="searchApplication"></el-input>
    </el-form-item>
    <el-form-item label="甲方单位">
      <el-input v-model="partyAName" placeholder="甲方单位" @keyup.enter.native="searchApplication"></el-input>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" @click="searchApplication">查询</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "applicationModule"
);
export default {
  data() {
    return {
      projectName: "",
      salesman: "",
      partyAName: ""
    };
  },
  computed: {
    ...mapState(["search"])
  },
  methods: {
    ...mapMutations(["setSearch", "setCurrentPage"]),
    ...mapActions(["getApplicationList"]),
    searchApplication() {
      let { projectName, salesman, partyAName } = this,
        newSearch = {};
      if (projectName) {
        newSearch.projectName = projectName;
      }
      if (partyAName) {
        newSearch.partyAName = partyAName;
      }
      if (salesman) {
        newSearch.salesman = salesman;
      }
      for (let key in this.search) {
        if (
          key === "directorState" ||
          key === "produceState" ||
          key === "causeState"
        ) {
          continue;
        }
        delete this.search[key];
      }
      newSearch = { ...this.search, ...newSearch };
      this.setSearch(newSearch);
      this.setCurrentPage(1);
      this.getApplicationList();
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 150px;
}
</style>
