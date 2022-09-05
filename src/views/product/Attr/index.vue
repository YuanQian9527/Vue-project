<template>
  <div>
    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <!-- 三级联动组件 -->
      <CategorySelect @getCategoryId="getCategoryId" :show="!isShowTable" />
    </el-card>

    <el-card shadow="always" :body-style="{ padding: '20px' }">
      <div v-show="isShowTable">
        <el-button
          type="primary"
          icon="el-icon-plus"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table border style="width: 100%" :data="attrList">
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称" width="150">
          </el-table-column>
          <el-table-column prop="col.id" label="属性列表">
            <template slot-scope="{ row }">
              <el-tag
                type="success"
                v-for="attrValue in row.attrValueList"
                :key="attrValue.id"
                style="margin: 10px 20px"
                >{{ attrValue.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column prop="col.id" label="操作" width="150">
            <template slot-scope="{ row }">
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-edit"
                @click="updateAttr(row)"
              ></el-button>
              <el-button
                type="danger"
                size="mini"
                icon="el-icon-delete"
                @click="deleteAttr(row)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加属性值结构 -->
      <div v-show="!isShowTable">
        <el-form label-width="80px" :inline="true" ref="form" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          size="default"
          icon="el-icon-plus"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-button>取消</el-button>
        <!-- 添加属性值数据展示 -->
        <el-table
          border
          style="width: 100%; margin: 20px 0"
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" width="80" align="center">
          </el-table-column>
          <el-table-column prop="valueName" label="属性名称">
            <template slot-scope="{ row, $index }">
              <el-input
                size="mini"
                placeholder="请输入属性名称"
                v-model.trim="row.valueName"
                v-if="row.flag"
                @blur="toLook(row)"
                @keyup.native.enter="row.flag = false"
                :ref="$index"
              ></el-input>
              <span
                v-else
                @click="toEdit(row, $index)"
                style="display: block"
                >{{ row.valueName }}</span
              >
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="150">
            <template slot-scope="{ row, $index }">
              <el-popconfirm
                :title="`确定删除${row.valueName}吗`"
                @onConfirm="deletevalueName($index)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  size="mini"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button
          type="primary"
          @click="addOrUpdateAttr"
          :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowTable = true">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import cloneDeep from "lodash/cloneDeep";
export default {
  name: "attr",
  inject: ["reload"],
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      //接收平台属性数据
      attrList: [],
      //控制table的显示与隐藏
      isShowTable: true,
      //添加 修改属性名
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0, //三级分类的
        categoryLevel: 3, //三级分类的
      },
    };
  },
  methods: {
    //自定义事件
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
        this.getAttrList();
      }
    },
    //获取分类列表
    async getAttrList() {
      const { category1Id, category2Id, category3Id } = this;
      let res = await this.$api.attr.getAttrList(
        category1Id,
        category2Id,
        category3Id
      );
      console.log(res);
      this.attrList = res.data;
    },
    //添加属性值
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        flag: true, //input和span的切换标识
      });
      this.$nextTick(() => {
        this.$refs[this.attrInfo.attrValueList.length - 1].focus();
      });
    },
    //添加属性按钮的回调
    addAttr() {
      //切换table的显示与隐藏
      this.isShowTable = false;
      //清空数据 收集三级分类id
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //三级分类的
        categoryLevel: 3, //三级分类的
      };
    },
    //修改属性列表按钮的回调
    updateAttr(row) {
      console.log(row);
      //切换table的显示与隐藏
      this.isShowTable = false;
      //将选中的属性回显
      this.attrInfo = cloneDeep(row); //使用深拷贝
      console.log(this.attrInfo);
      //修改某一项的时候添加上flag
      this.attrInfo.attrValueList.forEach((item) => {
        //vue无法检测普通新增的property数据 因为这样的数据不是响应式的 视图无法跟着变化
        //使用$set 第一个参数是对象 第二是属性名 第三是属性值
        this.$set(item, "flag", false);
      });
    },
    //删除属性列表按钮的回调
    async deleteAttr(row) {
      let res = await this.$api.attr.delAttrInfo(row.id);
      console.log(res);
      if (res.message == "成功") {
        this.$message.success("删除成功");
        
        //刷新页面
        // this.$router.go(0);
        this.reload()
        this.getAttrList()
        
      } else {
        this.$message("删除失败");
      }
    },
    //失去焦点 切换查看模式
    toLook(row) {
      row.flag = false;
      //input数据的判断空值和去重
      let isRep = this.attrInfo.attrValueList.some((item) => {
        if (row !== item) {
          return row.valueName == item.valueName;
        }
      });
      console.log(isRep);
      if (isRep) return;
    },
    //获取焦点 切换编辑模式
    toEdit(row, index) {
      row.flag = true;
      //获取input节点 实现聚焦
      //渲染节点 浏览器需要时间的 这里使用$nextTick() 渲染完毕才执行
      this.$nextTick(() => {
        this.$refs[index].focus();
      });
    },
    //删除按钮回调 饿了么UI版本要是2.15.x的
    deletevalueName(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    //保存按钮的回调
    async addOrUpdateAttr() {
      this.attrInfo.attrValueList.filter((item) => {
        //过滤空数据
        if (item.valueName != "") {
          //删除flag字段
          delete item.flag;
          return true;
        }
      });
      //发请求
      try {
        await this.$api.attr.getAttrInfo(this.attrInfo);
        this.isShowTable = true;
        this.$message.success("保存成功");
        this.getAttrList();
      } catch (error) {
        this.$message("保存失败");
      }
    },
  },
};
</script>

<style lang="sass" scoped>
</style>