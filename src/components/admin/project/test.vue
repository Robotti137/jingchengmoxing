<template>
  <div>
    <AddProject/>
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
export default {
  components: {
    AddProject,
    ListProject,
    UpdateProject,
    PageProject
  }
};
</script>

<style>
</style>
