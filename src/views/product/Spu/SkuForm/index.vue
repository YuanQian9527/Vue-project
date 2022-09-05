<template>
  <div>
    <el-form ref="form" label-width="80px">
      <el-form-item label="spu名称">
        {{ spu.spuName }}
      </el-form-item>
      <el-form-item label="sku名称">
        <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格">
        <el-input
          placeholder="价格"
          type="number"
          v-model="skuInfo.price"
        ></el-input>
      </el-form-item>
      <el-form-item label="重量">
        <el-input
          placeholder="重量"
          type="number"
          v-model="skuInfo.weight"
        ></el-input>
      </el-form-item>
      <el-form-item label="规格描述">
        <el-input type="textarea" rows="4" v-model="skuInfo.skuDesc"></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item
            :label="attr.attrName"
            v-for="attr in AttrList"
            :key="attr.id"
          >
            <el-select placeholder="请选择" v-model="attr.attrIdAndValueId">
              <el-option
                :label="attrValue.valueName"
                :value="`${attr.id}:${attrValue.id}`"
                v-for="attrValue in attr.attrValueList"
                :key="attrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form ref="form" label-width="80px" :inline="true">
          <el-form-item
            :label="saleAttr.saleAttrName"
            v-for="saleAttr in SpuSaleList"
            :key="saleAttr.id"
          >
            <el-select placeholder="请选择" v-model="saleAttr.attrIdAndValueId">
              <el-option
                :label="saleAttrValue.saleAttrValueName"
                :value="`${saleAttr.id}:${saleAttrValue.id}`"
                v-for="saleAttrValue in saleAttr.spuSaleAttrValueList"
                :key="saleAttrValue.id"
              >
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片列表">
        <el-table border :data="SpuImageList">
          <el-table-column type="selection" prop="col.id" width="80">
          </el-table-column>
          <el-table-column prop="col.id" label="图片">
            <template slot-scope="{ row, $index }">
              <img :src="row.imgUrl" style="width: 50%" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"> </el-table-column>
          <el-table-column prop="col.id" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                size="mini"
                v-if="row.isDefault === 0"
                @click="changeDefault(row)"
                >设置默认</el-button
              >
              <el-button type="primary" size="mini" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="save">保存</el-button>
        <el-button @click="$emit('changeScene', 0)">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spu: [],
      SpuImageList: [],
      SpuSaleList: [], //销售属性
      AttrList: [], //平台属性
      skuInfo: {
        category3Id: 0,
        isSale: 0,
        price: 1,
        spuId: 0,
        tmId: 0,
        weight: "1",
        skuAttrValueList: [
          //   {
          //     attrId: 0,
          //     attrName: "string",
          //     id: 0,
          //     skuId: 0,
          //     valueId: 0,
          //     valueName: "string",
          //   },
        ],
        skuDefaultImg: "string",
        skuDesc: "string",
        skuName: "",
        skuImageList: [
          //   {
          //     id: 0,
          //     imgName: "string",
          //     imgUrl: "string",
          //     isDefault: "string",
          //     skuId: 0,
          //     spuImgId: 0,
          //   },
        ],

        skuSaleAttrValueList: [
          //   {
          //     id: 0,
          //     saleAttrId: 0,
          //     saleAttrName: "string",
          //     saleAttrValueId: 0,
          //     saleAttrValueName: "string",
          //     skuId: 0,
          //     spuId: 0,
          //   },
        ],
      },
      //收集图片数据 但是缺少isdefault字段
      imgList: [],
    };
  },
  methods: {
    async getSkuData(category1Id, category2Id, row) {
      //收集父组件给的数据
      this.skuInfo.category3Id = row.category3Id;
      this.skuInfo.spuId = row.id;
      this.skuInfo.tmId = row.tmId;
      this.spu = row;

      let res = await this.$api.sku.getSpuImageList(row.id);
      let lists = res.data;
      //给每一项加上isDefault字段
      lists.forEach((item) => {
        item.isDefault = 0;
      });
      this.SpuImageList = lists;
      let res1 = await this.$api.sku.getSpuSaleList(row.id);
      this.SpuSaleList = res1.data;
      let res2 = await this.$api.sku.getAttrList(
        category1Id,
        category2Id,
        row.category3Id
      );
      //   console.log(res2);
      this.AttrList = res2.data;
    },
    //table复选框勾选事件
    selectOnChange(val) {
      this.imgList = val;
    },
    changeDefault(row) {
      //排他思想
      this.SpuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    async save() {
      //整理数据
      let arr = [];
      const { AttrList, skuInfo, SpuSaleList, imgList } = this;
      AttrList.forEach((item) => {
        if (item.attrIdAndValueId) {
          //解构为服务器需要的字段
          const [attrId, valueId] = item.attrIdAndValueId.split(":");
          let obi = { attrId, valueId };
          arr.push(obi);
        }
      });
      skuInfo.skuAttrValueList = arr;
      skuInfo.skuSaleAttrValueList = SpuSaleList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          const [saleAttrId, saleAttrValueId] =
            item.attrIdAndValueId.split(":");
          prev.push({ saleAttrId, saleAttrValueId });
        }
      }, []);
      skuInfo.skuImageList = imgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      let res = await this.$api.sku.addSku(skuInfo);
      console.log(res);
      if (res.code==200) {
          this.$message.success("保存sku成功")
          this.$emit('changeScene', 0)
      }
    },
  },
};
</script>

<style lang="sass" scoped>
</style>