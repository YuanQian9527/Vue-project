<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div slot="header">
        <div class="search-header">
          <span>线上热门搜索</span>
          <i class="el-icon-more"></i>
        </div>
      </div>
      <div>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <div ref="a" class="a"></div>
          </el-col>
          <el-col :span="12" :offset="0">
            <div ref="b" class="b"></div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
export default {
  data() {
    return {};
  },
  methods: {
    lineCharts() {
      //初始化echarts实例
      var myCharts = echarts.init(this.$refs.a);
      var myCharts1 = echarts.init(this.$refs.b);
      //配置数据
      myCharts.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      });
       myCharts1.setOption({
        xAxis: {
          type: "category",
          data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        },
        yAxis: {
          type: "value",
        },
        series: [
          {
            data: [150, 230, 224, 218, 135, 147, 260],
            type: "line",
          },
        ],
      });
    },
  },
  mounted() {
    this.lineCharts();
  },
};
</script>

<style scoped>
.search-header {
  display: flex;
  justify-content: space-between;
}
.a,.b{
    width: 100%;
    height: 320px;
}
</style>