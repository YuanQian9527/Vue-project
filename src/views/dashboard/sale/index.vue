<template>
  <div>
    <el-card shadow="always" style="margin: 10px 0">
      <div slot="header" class="clearfix">
        <!-- 左侧内容 -->
        <el-tabs v-model="activeName">
          <el-tab-pane label="销售额" name="sale"></el-tab-pane>
          <el-tab-pane label="访问量" name="visite"></el-tab-pane>
        </el-tabs>
        <!-- 右侧内容 -->
        <div class="right">
          <span @click="setDay">今日</span>
          <span @click="setWeek">本周</span>
          <span @click="setMonth">本月</span>
          <span @click="setYear">本年</span>
          <el-date-picker
            class="date"
            v-model="data"
            type="datetimerange"
            value-format="yyyy-MM-dd"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
        </div>
      </div>
      <!-- 右边数据展示 -->
      <div>
        <el-row :gutter="20">
          <el-col :span="18" :offset="0">
            <div class="charts" ref="charts"></div>
          </el-col>
          <el-col :span="6" :offset="0">
            <div>
              <h3>门店{{ title }}排名</h3>
              <ul>
                <li>
                  <span class="rindex">1</span>
                  <span class="rvalue">肯德基</span>
                  <span class="rvalue">452155</span>
                </li>
                <li>
                  <span class="rindex">2</span>
                  <span class="rvalue">麦当劳</span>
                  <span class="rvalue">1234</span>
                </li>
                <li>
                  <span class="rindex">3</span>
                  <span class="rvalue">德克士</span>
                  <span class="rvalue">514</span>
                </li>
                <li>
                  <span class="a">4</span>
                  <span class="rvalue">汉堡王</span>
                  <span class="rvalue">12</span>
                </li>
                <li>
                  <span class="a">5</span>
                  <span class="rvalue">饿了么</span>
                  <span class="rvalue">12</span>
                </li>
                <li>
                  <span class="a">6</span>
                  <span class="rvalue">美团</span>
                  <span class="rvalue">12</span>
                </li>
              </ul>
            </div>
          </el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>

<script>
import * as echarts from "echarts";
import dayjs from "dayjs";
export default {
  data() {
    return {
      activeName: "sale",
      myCharts: null,
      //收集日历时间数据
      data: [],
    };
  },
  mounted() {
    //初始化echarts实例
    this.myCharts = echarts.init(this.$refs.charts);
    //配置数据
    this.myCharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      grid: {
        left: "3%",
        right: "3",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "数量",
          type: "bar",
          barWidth: "60%",
          data: [112, 352, 300, 334, 590, 330, 220, 123, 234, 564, 156, 247],
          color: "pink",
        },
      ],
    });
  },
  computed: {
    //计算属性 标题
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  //监听属性
  watch: {
    title() {
      this.myCharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods: {
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.data = [day, day];
    },
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(0).format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.data = [start, end];
    },
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.data = [start, end];
    },
  },
};
</script>

<style scoped>
.clearfix {
  display: flex;
  justify-content: space-between;
  position: relative;
}
.right {
  position: absolute;
  right: 0;
}
.date {
  width: 250px;
  height: 35px;
}
.right > span {
  margin-right: 15px;
}
.charts {
  width: 100%;
  height: 300px;
}
ul {
  list-style: none;
  padding-left: 20px;
}

.rindex {
  display: inline-block;
  width: 25px;
  height: 25px;
  background: #000;
  border-radius: 50%;
  color: white;
  line-height: 25px;
  text-align: center;
}
.rvalue {
  display: inline-block;
  width: 50px;
  /* 给一个固定的宽度可以防止字数不一样时 上下不对齐的问题 */
  margin: 10px 30px;
}
.a {
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 25px;
  text-align: center;
}
</style>