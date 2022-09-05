<template>
  <div>
    首页
    <Card />
  </div>
</template>

<script>
import Card from "./card/index.vue";
export default {
  name: "Dashboard",
  data() {
    return {};
  },
  components: {
    Card,
  },
};
</script>

<style lang="scss" scoped>
</style>
