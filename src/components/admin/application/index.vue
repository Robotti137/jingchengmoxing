<template>
  <div>
    <div style="display:flex;">
      <AddApplication/>
      <SearchApplication/>
      <div style="padding-top:6px;" v-if="judgeApprovePurview">
        <el-button size="small" @click="unApproved" :disabled="!btnDisable">全部</el-button>
        <el-badge :value="unapprovedTotal" class="item" style="margin-left:15px;">
          <el-button size="small" @click="unApproved(1)" :disabled="btnDisable">未批</el-button>
        </el-badge>
      </div>
    </div>
    <ListApplication/>
    <UpdateApplication/>
    <PageApplication/>
  </div>
</template>

<script>
import AddApplication from "./AddApplication";
import ListApplication from "./ListApplication";
import UpdateApplication from "./UpdateApplication";
import PageApplication from "./PageApplication";
import SearchApplication from "./SearchApplication";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "applicationModule"
);
export default {
  data() {
    return {
      btnDisable: false
    };
  },
  computed: {
    ...mapState(["unapprovedTotal", "search"]),
    judgeApprovePurview() {
      let approvePurview = JSON.parse(sessionStorage.getItem("jcmx-userinfo"))
        .approvePurview;
      if (approvePurview) {
        return true;
      } else {
        return false;
      }
    }
  },
  methods: {
    ...mapActions(["getApplicationList"]),
    ...mapMutations(["setSearch", "setCurrentPage"]),
    unApproved(value) {
      if (this.btnDisable) {
        this.btnDisable = false;
      } else {
        this.btnDisable = true;
      }
      let approvePurview = JSON.parse(sessionStorage.getItem("jcmx-userinfo"))
          .approvePurview,
        { search } = this;
      if (approvePurview === 1) {
        approvePurview = "directorState";
      } else if (approvePurview === 2) {
        approvePurview = "produceState";
      } else if (approvePurview === 3) {
        approvePurview = "causeState";
      }
      if (typeof value !== "object") {
        search[approvePurview] = 0;
      } else {
        delete search[approvePurview];
      }
      this.setSearch(search);
      this.setCurrentPage(1);
      this.getApplicationList();
    }
  },
  components: {
    AddApplication,
    ListApplication,
    UpdateApplication,
    PageApplication,
    SearchApplication
  }
};
</script>

<style>
</style>
