<template>
  <div>
    <el-form ref="form" label-width="80px" size="normal" :model="spu">
      <el-form-item label="spu名称">
        <el-input placeholder="spu名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in trademarkList"
            :key="tm.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="spu描述">
        <el-input
          placeholder="spu描述"
          type="textarea"
          rows="4"
          v-model="spu.description"
        ></el-input>
      </el-form-item>
      <el-form-item label="spu图片">
        <el-upload
          action="/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :on-success="handleSuccess"
          :file-list="SpuImageList"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>

      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectSale.length}条未选择`"
          v-model="attrId"
        >
          <el-option
            :label="unSelect.name"
            :value="`${unSelect.id}:${unSelect.name}`"
            v-for="unSelect in unSelectSale"
            :key="unSelect.id"
          >
          </el-option>
        </el-select>
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          :disabled="!attrId"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <!-- 展示销售属性数据 -->
        <el-table border :data="spu.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column prop="col.id" label="属性名称列表">
            <template slot-scope="{ row, $index }">
              <el-tag
                :key="index"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
                @close="row.spuSaleAttrValueList.splice(index, 1)"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <!-- 这块是input和elbutton的切换 @keyup.enter.native="handleInputConfirm"
                @blur="handleInputConfirm"-->
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSaleValue(row)"
                >添加
              </el-button>
            </template>
          </el-table-column>
          <el-table-column prop="col.id" label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <!-- 底部按钮 -->
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSpu">保存</el-button>
        <el-button @click="cencel">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogImageUrl: "",
      dialogVisible: false,
      //添加spu的时候 收集数据
      spu: {
        category3Id: 0,
        description: "",
        id: 0,
        tmId: "",
        spuName: "",
        spuImageList: [
          // {
          //   id: 0,
          //   imgName: "string",
          //   imgUrl: "string",
          //   spuId: 0,
          // },
        ],
        //平台属性的收集
        spuSaleAttrList: [
          //   {
          //     baseSaleAttrId: 0,
          //     id: 0,
          //     saleAttrName: "string",
          //     spuId: 0,
          //     spuSaleAttrValueList: [
          //       {
          //         // inputVisible:"",
          //         baseSaleAttrId: 0,
          //         id: 0,
          //         isChecked: "string",
          //         saleAttrName: "string",
          //         saleAttrValueName: "string",
          //         spuId: 0,
          //       },
          //     ],
          //   },
        ],
      },
      trademarkList: [],
      SpuImageList: [],
      SaleAttrList: [],
      attrId: "", //销售属性的id
    };
  },
  computed: {
    unSelectSale() {
      //filter过滤属性列表 every过滤已有的属性
      return this.SaleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item.name != item1.saleAttrName;
        });
      });
    },
  },
  methods: {
    handleRemove(file, fileList) {
      console.log(file, fileList);
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      //打开对话框
      this.dialogVisible = true;
      //图片的url赋值
      this.dialogImageUrl = file.url;
    },
    handleSuccess(response, file, fileList) {
      this.SpuImageList = fileList;
    },
    //初始化数据
    async initSpuData(spu) {
      //获取spu信息
      let spures = await this.$api.spu.getSpu(spu.id);
      //   console.log(spures)
      this.spu = spures.data;
      //获取品牌信息
      let trmres = await this.$api.spu.getTrademarkList();
      this.trademarkList = trmres.data;
      //获取sku图片
      let spuimgres = await this.$api.spu.getSpuImageList(spu.id);
      //   console.log(spuimgres)
      let ImageArray = spuimgres.data;
      //处理数据字段替换
      ImageArray.forEach((item) => {
        item.name = item.imgName;
        item.url = item.imgUrl;
      });
      this.SpuImageList = ImageArray;
      //获取销售属性
      let Saleres = await this.$api.spu.getBaseSaleAttrList();
      this.SaleAttrList = Saleres.data;
    },
    //添加销售属性
    addSaleAttr() {
      const [baseSaleAttrId, saleAttrName] = this.attrId.split(":");
      let newSaleAttr = { baseSaleAttrId, saleAttrName, SaleAttrValueList: [] };
      this.spu.spuSaleAttrList.push(newSaleAttr);
      this.attrId = "";
    },
    addSaleValue(row) {
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    handleInputConfirm(row) {
      const { baseSaleAttrId, inputValue } = row;
      if (inputValue.trim() == "") {
        this.$message("属性值不允许为空");
        return;
      }
      // console.log(row.spuSaleAttrValueList);
      if (!row.spuSaleAttrValueList) {
        row.spuSaleAttrValueList = [];
      }
      let res = row.spuSaleAttrValueList.some(
        (item) => item.saleAttrValueName == inputValue
      );
      // console.log(res);
      if (res) {
        this.$message("属性值重复");
        return;
      }

      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
    },
    //保存 添加spu
    async addOrUpdateSpu() {
      //整理参数 与服务器要求的一致
      this.spu.spuImageList = this.SpuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let res = await this.$api.spu.addOrUpdateSpuList(this.spu);
      console.log(res);
      this.$message.success("保存成功");
      //通知父组件回到场景0
      this.$emit("changeScene", 0);
      //清空数据
      Object.assign(this._data,this.$options.data())
    },

    async addSpuData(category3Id) {
      this.spu.category3Id=category3Id
      //获取品牌信息
      let trmres = await this.$api.spu.getTrademarkList();
      this.trademarkList = trmres.data;
      //获取销售属性
      let Saleres = await this.$api.spu.getBaseSaleAttrList();
      this.SaleAttrList = Saleres.data;
    },
    //取消按钮的回调
    cencel(){
      this.$emit('changeScene', 0)
      //因为修改和新增共用一个页面 每次关闭页面时需要清除表单的数据assign()合并数组
      Object.assign(this._data,this.$options.data())
    }
  },
};
</script>

<style>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>