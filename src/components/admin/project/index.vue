<template>
  <div>
    <div style="display:flex;">
      <AddProject/>
      <SearchProject/>
    </div>
    <ListProject/>
    <UpdateProject/>
    <PageProject/>
  </div>
</template>

<script>
import AddProject from "./AddProject";
import ListProject from "./ListProject";
import UpdateProject from "./UpdateProject";
import PageProject from "./PageProject";
import SearchProject from "./SearchProject";
export default {
  components: {
    AddProject,
    ListProject,
    UpdateProject,
    PageProject,
    SearchProject
  }
};
</script>

<style>
</style>
