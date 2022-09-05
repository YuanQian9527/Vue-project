<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6" :offset="0">
        <el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="总销售额" count="¥124125">
            <template slot="charts">
              <span
                >同周比&nbsp;56.67%
                <svg
                  t="1662365232704"
                  class="icon"
                  viewBox="0 0 1026 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="2482"
                  width="16"
                  height="16"
                >
                  <path
                    d="M420.864 448.512l-164.864 140.288 0-187.392 185.344-162.816 7.168 8.192 164.864 193.536 197.632-205.824-106.496-105.472 317.44-2.048 0 315.392-107.52-105.472-313.344 326.656-3.072-7.168zM928.768 703.488q19.456 0 37.376 7.68t30.72 20.48 20.48 30.72 7.68 37.376q0 20.48-7.68 37.888t-20.48 30.208-30.72 20.48-37.376 7.68l-832.512 0q-20.48 0-37.888-7.68t-30.208-20.48-20.48-30.208-7.68-37.888l0-641.024q0-19.456 7.68-36.864t20.48-30.208 30.208-20.48 37.888-7.68q19.456 0 37.376 7.68t30.72 20.48 20.48 30.208 7.68 36.864l0 481.28 4.096 0-4.096 3.072 0 60.416 736.256 0z"
                    p-id="2483"
                    fill="#1afa29"
                  ></path></svg
              ></span>
            </template>
            <template slot="footer">
              <span>日销售额:¥12383</span>
            </template>
          </Detail>
        </el-card>
      </el-col>
      <el-col :span="6" :offset="0"
        ><el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="访问量" count="88460">
              <template slot="charts">
                  <lineCharts/>
              </template>
            <template slot="footer">
              <span>日访问量:4523</span>
            </template>
          </Detail>
        </el-card></el-col
      >
      <el-col :span="6" :offset="0"
        ><el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="支付笔数" count="88460">
              <template slot="charts">
                  <barCharts/>
              </template>
            <template slot="footer">
              <span>转化率:%57</span>
            </template>
          </Detail>
        </el-card></el-col
      >
      <el-col :span="6" :offset="0"
        ><el-card shadow="always" :body-style="{ padding: '20px' }">
          <Detail title="运营活动效果" count="78%">
               <template slot="charts">
                  <progressCharts/>
              </template>
            <template slot="footer">
              <span>增长率:%23</span>
            </template>
          </Detail>
        </el-card></el-col
      >
    </el-row>
  </div>
</template>

<script>
import Detail from "./detail/index.vue";
import lineCharts from "./lineCharts/index.vue";
import barCharts from "./barCharts/index.vue";
import progressCharts from "./progressCharts/index.vue";
export default {
  data() {
    return {};
  },
  components: {
    Detail,lineCharts,barCharts,progressCharts
  },
};
</script>

<style lang="sass" scoped>
</style>