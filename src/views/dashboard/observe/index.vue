<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="12" :offset="0">
        <Search />
      </el-col>
      <el-col :span="12" :offset="0">
        <Category />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from "./search/index.vue";
import Category from "./category/index.vue";
export default {
  data() {
    return {};
  },
  components: {
    Search,
    Category,
  },
};
</script>

<style scoped>
</style>