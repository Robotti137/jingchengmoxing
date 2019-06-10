<template>
  <div>
    <AddProject/>
    <ListProject/>
    <UpdateProject/>
  </div>
</template>

<script>
import AddProject from "./AddProject";
import ListProject from "./ListProject";
import UpdateProject from "./UpdateProject";
export default {
  components: {
    AddProject,
    ListProject,
    UpdateProject
  }
};
</script>

<style>
</style>
