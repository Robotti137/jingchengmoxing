<template>
  <el-pagination
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="pagination.currentPage"
    :page-sizes="[10, 15, 20, 30]"
    :page-size="10"
    layout="total, sizes, prev, pager, next, jumper"
    :total="pagination.total"
  ></el-pagination>
</template>

<script>
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "projectModule"
);
export default {
  computed: {
    ...mapState(["pagination"])
  },
  methods: {
    ...mapActions(["getProjectList"]),
    handleSizeChange(val) {
      this.pagination.rows = parseInt(val);
      this.pagination.currentPage = 1;
      let { currentPage, rows } = this.pagination;
      this.getProjectList({ currentPage, rows });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = parseInt(val);
      let { currentPage, rows } = this.pagination;
      this.getProjectList({ currentPage, rows });
    }
  }
};
</script>

<style>
</style>
