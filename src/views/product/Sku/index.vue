<template>
  <div>
    <el-table border :data="records">
      <el-table-column
        type="index"
        label="序号"
        width="80"
        align="center"
      ></el-table-column>
      <el-table-column prop="skuName" label="名称"></el-table-column>
      <el-table-column prop="skuDesc" label="描述"></el-table-column>
      <el-table-column prop="skuDefaultImg" label="默认图片" width="110">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" style="width: 100%" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量" width="80"></el-table-column>
      <el-table-column prop="price" label="价格" width="80"></el-table-column>
      <el-table-column prop="col.id" label="操作">
        <template slot-scope="{ row }">
          <el-button
            type="success"
            size="mini"
            @click="cancelSale(row)"
            icon="el-icon-sort-down"
            v-if="row.isSale == 1"
          ></el-button>
          <el-button
            type="success"
            size="mini"
            @click="onSale(row)"
            icon="el-icon-sort-up"
            else
            :disabled="row.isSale == 1"
          ></el-button>
          <el-button
            type="info"
            size="mini"
            @click="info(row)"
            icon="el-icon-info"
          ></el-button>
          <el-button type="primary" size="mini" icon="el-icon-edit"></el-button>
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      align="center"
      @size-change="sizeChange"
      @current-change="getSkuList"
      :current-page="page"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="limit"
      layout="prev, pager, next, jumper,->,sizes,total"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 :before-close="handleClose"-->
    <el-drawer :visible.sync="drawer" size="35%">
      <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="0"><h2>名称</h2></el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="0"><h2>描述</h2></el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="0"><h2>价格</h2></el-col>
        <el-col :span="16" :offset="0">{{ skuInfo.price }}元</el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="0"><h2>平台属性</h2></el-col>
        <el-col :span="16" :offset="0">
          <template>
            <el-tag
              type="success"
              size="normal"
              v-for="attr in skuInfo.skuAttrValueList"
              :key="attr.id"
              >{{ attr.attrId }}-{{ attr.valueId }}</el-tag
            >
          </template>
        </el-col>
      </el-row>
      <el-row :gutter="20" type="flex">
        <el-col :span="5" :offset="0"><h2>商品图片</h2></el-col>
        <el-col :span="16" :offset="0">
          <el-carousel height="450px">
            <el-carousel-item
              v-for="item in skuInfo.skuImageList"
              :key="item.id"
            >
              <img :src="item.imgUrl" style="width: 100%" />
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  name: "sku",
  data() {
    return {
      page: 1,
      limit: 3,
      records: [],
      total: 0,
      skuInfo: {},
      drawer: false,
    };
  },
  methods: {
    sizeChange(limit) {
      this.limit = limit;
      this.getSkuList();
    },
    async getSkuList(pages = 1) {
      this.page = pages;
      const { page, limit } = this;
      let res = await this.$api.sku.getSkuList(page, limit);
      console.log(res);
      this.total = res.data.total;
      this.records = res.data.records;
    },
    async cancelSale(row) {
      let res = await this.$api.sku.cancelSale(row.id);
      if (res.code == 200) {
        this.$message.success("下架成功");
        row.isSale = 0;
      }
    },
    async onSale(row) {
      let res = await this.$api.sku.onSale(row.id);
      if (res.code == 200) {
        this.$message.success("上架成功");
        row.isSale = 1;
      }
    },
    async info(row) {
      this.drawer = true;
      let res = await this.$api.sku.getSku(row.id);
      this.skuInfo = res.data;
    },
  },
  mounted() {
    this.getSkuList();
  },
};
</script>

<style  scoped>
.el-row {
  flex-direction: column;
  align-items: flex-start;
}
</style>
<style>
.el-carousel__item h3 {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 150px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
</style>