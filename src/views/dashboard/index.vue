<template>
  <div>
    <Card />
    <!-- 数据表格展示 -->
    <Sale />
    <Observe />
  </div>
</template>

<script>
import Card from "./card/index.vue";
import Sale from "./sale/index.vue";
import Observe from "./observe/index.vue";
export default {
  name: "Dashboard",
  data() {
    return {};
  },
  components: {
    Card,
    Sale,
    Observe,
  },
};
</script>

<style lang="scss" scoped>
</style>
