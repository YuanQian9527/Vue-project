<template>
  <div>
    <el-form :inline="true" class="demo-form-inline" :model="cForm">
      <el-form-item label="一级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category1Id"
          @change="handler1"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in list1"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category2Id"
          @change="handler2"
          :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in list2"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级分类">
        <el-select
          placeholder="请选择"
          v-model="cForm.category3Id"
          @change="handler3"
          :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in list3"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props:["show"],
  data() {
    return {
      //一级分类数据
      list1: [],
      //二级分类数据
      list2: [],
      //二级分类数据
      list3: [],
      //收集一级二级三级分类id
      cForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  methods: {
    //一级分类数据
    async get1List() {
      let res = await this.$api.attr.getCategory1List();
      // console.log(res);
      this.list1 = res.data;
    },
    //一级分类变化的方法
    async handler1() {
      //清空二级 三级数据
      this.list2 = [];
      this.list3 = [];
      this.cForm.category2Id = "";
      this.cForm.category3Id = "";
      //解构出一级分类id
      const { category1Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category1Id,level:1});
      let res = await this.$api.attr.getCategory2List(category1Id);
      // console.log(res);
      this.list2 = res.data;
    },
    //二级分类变化的方法
    async handler2() {
      //清空三级数据
      this.list3 = [];
      this.cForm.category3Id = "";
      //解构出二级分类id
      const { category2Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category2Id,level:2});
      let res = await this.$api.attr.getCategory3List(category2Id);
      // console.log(res);
      this.list3 = res.data;
    },
    //三级分类变化发送请求获取数据展示
    handler3() {
      //解构出三级分类id
      const { category3Id } = this.cForm;
      this.$emit("getCategoryId", {categoryId:category3Id,level:3});
    },
  },
  mounted() {
    this.get1List();
  },
};
</script>

<style lang="sass" scoped>
</style>