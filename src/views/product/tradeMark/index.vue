<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      style="margin: 10px 0"
      @click="showDialog"
      >添加</el-button
    >
    <!-- 表格数据展示 -->
    <el-table :data="tableData" border style="width: 100%; margin-bottom: 20px">
      <el-table-column type="index" label="序号" width="80" align="center">
      </el-table-column>
      <el-table-column prop="tmName" label="会议名称" align="center">
      </el-table-column>
      <el-table-column prop="logoUrl" label="会议图片" align="center">
        <template slot-scope="{ row, $index }">
          <img :src="row.logoUrl" style="width: 150px; height: 100px" />
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" align="center">
        <template slot-scope="{ row }">
          <el-button type="primary" size="mini" icon="el-icon-edit" @click="updateTradeMark(row)"
            >修改</el-button
          >
          <el-button type="danger" size="mini" icon="el-icon-delete"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页器 ->设置间距可以靠右-->
    <el-pagination
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
      style="text-align: center"
      :current-page="page"
      :page-sizes="[3, 5, 7, 10]"
      :page-size="limit"
      layout=" prev, pager, next, jumper,->,sizes, total"
      :total="total"
    >
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加品牌" :visible.sync="dialogFormVisible">
      <el-form style="width: 80%" :model="tmform">
        <el-form-item label="品牌名称" label-width="100px">
          <el-input autocomplete="off" v-model="tmform.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌LOGO" label-width="100px">
          <!-- action上传图片的地址 -->
          <el-upload
            class="avatar-uploader"
            action="/admin/product/fileUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmform.logoUrl" :src="tmform.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="addTradeMark">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "tradeMark",
  data() {
    return {
      //默认展示页
      page: 2,
      //当前页展示条数
      limit: 5,
      //总数据
      total: 0,
      //列表数据
      tableData: [],
      //对话框显示隐藏
      dialogFormVisible: false,
      //添加品牌表单数据
      tmform: {
        //上传图片数据
        logoUrl: "",
        tmName: "",
        
      },
    };
  },
  methods: {
    async getPageList() {
      const { page, limit } = this;
      const res = await this.$api.trademark.getTradeMarkList(page, limit);
      console.log(res);
      if (res.code == 200) {
        this.total = res.data.total;
        this.tableData = res.data.records;
      }
    },
    //修改页码参数
    handleCurrentChange(val) {
      // console.log(`${val}`);
      this.page = val;
      this.getPageList();
    },
    //修改每页展示条数
    handleSizeChange(val) {
      this.limit = val;
      this.getPageList();
    },
    //打开对话框
    showDialog() {
      this.dialogFormVisible = true;
      //清空表单数据
      this.tmform = {
        tmName: "",
        logoUrl: "",
      };
    },
    handleAvatarSuccess(res, file) {
      //res上传成功的返回值
      //file也是上传成功返回数据
      console.log(res)
      this.tmform.logoUrl = res.data;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isJPG) {
        this.$message.error("上传头像图片只能是JPG");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小只能是2M以内");
      }
      return isJPG && isLt2M;
    },
    //确定按钮 添加或修改品牌
    addTradeMark() {
      this.dialogFormVisible = false;
      this.$api.trademark.addOrupdateTradeMark(this.tmform).then((res) => {
        console.log(res);
        if (res.code==200) {
          this.$message.success(this.tmform.id?"修改成功":"添加成功")
          this.getPageList()
        }else{
          this.$message("添加失败")
        }
      });
    },
    updateTradeMark(row){
      this.dialogFormVisible = true;
      //...做一个浅拷贝 防止页面上数据实时更新
      this.tmform={...row}
    }
  },
  mounted() {
    this.getPageList();
  },
};
</script>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>