<template>
  <div>
    <el-card shadow="always" style="margin: 20px 0">
      <!-- 三级联动组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="scene != 0" />
    </el-card>
    <el-card shadow="always">
      <!-- 将来这里有三个部分切换 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addSpu"
          >添加spu</el-button
        >
        <!-- 展示spu列表 -->
        <el-table border :data="records">
          <el-table-column
            type="index"
            label="序号"
            width="80"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="spuName"
            label="spu名称"
            width="120"
          ></el-table-column>
          <el-table-column prop="description" label="spu描述"></el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="{ row }">
              <HintButton
                type="success"
                size="mini"
                icon="el-icon-plus"
                title="添加sku"
                @click="toSku(row)"
              ></HintButton>
              <HintButton
                type="warning"
                size="mini"
                icon="el-icon-edit"
                title="修改spu"
                @click="updateSpu(row)"
              ></HintButton>
              <HintButton
                type="info"
                size="mini"
                icon="el-icon-info"
                title="查看当前spu的sku列表"
                @click="lookSku(row)"
              ></HintButton>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteSpu(row)"
              >
                <HintButton
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  title="删除spu"
                  slot="reference"
                ></HintButton>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          align="center"
          @current-change="getSpuList"
          @size-change="handleSizeChange"
          :page-sizes="[3, 5, 7, 10]"
          :page-size="3"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="23"
          :pager-count="7"
        >
        </el-pagination>
      </div>
      <SpuForm v-show="scene == 1" @changeScene="changeScene" ref="spu" />
      <SkuForm v-show="scene == 2" ref="sku" @changeScene="changeScene" />
      <el-dialog
        :title="spu.spuName"
        :visible.sync="dialogTableVisible"
        :before-close="close"
      >
        <el-table :data="skuList" border v-loading="loading">
          <el-table-column prop="skuName" label="名称"></el-table-column>
          <el-table-column prop="price" label="价格"></el-table-column>
          <el-table-column prop="weight" label="重量"></el-table-column>
          <el-table-column prop="prop" label="默认图片">
            <template slot-scope="{ row }">
              <img :src="row.skuDefaultImg" style="width: 50%" />
            </template>
          </el-table-column>
        </el-table>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import SpuForm from "./SpuForm";
import SkuForm from "./SkuForm";

export default {
  name: "spu",
  components: { SpuForm, SkuForm },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //控制spu列表的显示与隐藏
      // isShow: true,
      page: 1,
      limit: 3,
      total: 0,
      records: [], //spu列表数据
      scene: 0, //0代表spu列表展示 1代表添加修改spu 2代表添加sku
      dialogTableVisible: false,
      spu: {},
      skuList: [],
      loading: true,
    };
  },
  methods: {
    getCategoryId({ categoryId, level }) {
      if (level == 1) {
        this.category1Id = categoryId;
        this.category2Id = "";
        this.category3Id = "";
      } else if (level == 2) {
        this.category2Id = categoryId;
        this.category3Id = "";
      } else {
        this.category3Id = categoryId;
        //三级分类id都有了 发请求
        this.getSpuList();
      }
    },
    async getSpuList(pages = 1) {
      this.page = pages;
      const { page, limit, category3Id } = this;
      let res = await this.$api.spu.getSpuList(page, limit, category3Id);
      console.log(res);
      this.records = res.data.records;
    },
    // handleCurrentChange(page){
    //     this.page=page
    //     this.getSpuList()
    // }
    handleSizeChange(limit) {
      this.limit = limit;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      //通知子组件发请求
      this.$refs.spu.addSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.scene = 1;
      //获取子组件方法
      this.$refs.spu.initSpuData(row);
    },
    //自定义事件回调 val子组件传过来的值
    changeScene(val) {
      this.scene = val;
      //刷新列表 停留在当前页
      this.getSpuList(this.page);
    },
    async deleteSpu(row) {
      let res = this.$api.spu.delSpu(row.id);
      this.$message.success("删除成功");
      //刷新列表 停留在当前页
      this.getSpuList(this.records.length > 1 ? this.page : this.page - 1);
    },
    toSku(row) {
      this.scene = 2;
      this.$refs.sku.getSkuData(this.category1Id, this.category2Id, row);
    },
    changScene(val) {
      this.scene = val;
      //清空数据
      Object.assign(this._data, this.$options.data());
      //刷新列表 停留在当前页
      this.getSpuList(this.page);
    },
    async lookSku(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let res = await this.$api.sku.lookSku(row.id);
      // console.log(res)
      this.skuList = res.data;
      this.loading = false;
    },
    //关闭对话框回调
    close(done) {
      this.loading = true;
      this.skuList = [];
      //执行对话框
      done();
    },
  },
};
</script>

<style lang="sass" scoped>
</style>