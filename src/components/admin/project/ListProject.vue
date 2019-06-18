<template>
  <div>
    <!-- 列表 -->
    <el-table :data="project" stripe style="width: 100%">
      <el-table-column prop="create_time" label="创建时间" align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名" align="center"></el-table-column>
      <el-table-column label="剩余验收天数" width="130" align="center">
        <template slot-scope="scope">
          <span
            v-if="scope.row.state === 0"
            :class="dayState(formatTime(scope.row.end_time),'class')"
          >{{dayState(formatTime(scope.row.end_time),'')}}</span>
          <span v-else class="success">已验收</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" align="center"></el-table-column>
      <el-table-column label="文档" align="center">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="viewPDF(scope.row.pdfName)">查看</el-button>
          <el-button type="text" size="mini" @click="viewQRCode(scope.row.pdfName)">二维码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="公司验收单" width="130" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isHaveOrder(scope.row.companyAcceptanceOrder)"
            type="text"
            size="mini"
            @click="companyAcceptanceOrderVisible = true;_id = scope.row._id"
          >上传</el-button>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="companyAcceptanceOrderVisible = true;
              _id = scope.row._id;
              companyAcceptanceOrder = scope.row.companyAcceptanceOrder"
          >修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="客户验收单" width="130" align="center">
        <template slot-scope="scope">
          <el-button
            v-if="isHaveOrder(scope.row.clientAcceptanceOrder)"
            type="text"
            size="mini"
            @click="clientAcceptanceOrderVisible = true;_id = scope.row._id"
          >上传</el-button>
          <el-button
            v-else
            type="text"
            size="mini"
            @click="clientAcceptanceOrderVisible = true;
              _id = scope.row._id;
              clientAcceptanceOrder = scope.row.clientAcceptanceOrder"
          >修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210" align="center">
        <template slot-scope="scope">
          <el-button
            type="success"
            plain
            size="mini"
            @click="acceptance(scope.row)"
            :disabled="scope.row.state === 1"
          >验收</el-button>
          <el-button
            type="primary"
            plain
            size="mini"
            @click="updateProject(scope.row)"
            :disabled="judgePurview"
          >修改</el-button>
          <el-button
            type="danger"
            plain
            size="mini"
            @click="removeProject(scope.row._id)"
            :disabled="judgePurview"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="qrcodeVisible" width="30%" center>
      <div id="qrcode" ref="qrcode"></div>
    </el-dialog>
    <!-- 上传验公司验收单弹框 -->
    <el-dialog title="上传公司验收单" :visible.sync="companyAcceptanceOrderVisible" width="690px">
      <el-form size="medium">
        <el-form-item label="验收单上传：" :label-width="labelWidth">
          <div style="display:flex;">
            <el-upload
              accept=".jpg, .JPG, .png, .PNG"
              :action="requestUrl + '/upload'"
              list-type="picture-card"
              :file-list="companyAcceptanceOrder"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadCompanyAcceptanceOrder"
              :on-remove="removeCompanyAcceptanceOrder"
              ref="uploadCompanyAcceptanceOrder"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="submitCompanyAcceptanceOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传验客户验收单弹框 -->
    <el-dialog title="上传客户验收单" :visible.sync="clientAcceptanceOrderVisible" width="690px">
      <el-form size="medium">
        <el-form-item label="验收单上传：" :label-width="labelWidth">
          <div style="display:flex;">
            <el-upload
              accept=".jpg, .JPG, .png, .PNG"
              :action="requestUrl + '/upload'"
              list-type="picture-card"
              :file-list="clientAcceptanceOrder"
              :on-preview="handlePictureCardPreview"
              :on-success="uploadClientAcceptanceOrder"
              :on-remove="removeClientAcceptanceOrder"
              ref="uploadClientAcceptanceOrder"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </div>
        </el-form-item>
      </el-form>
      <div>
        <el-button type="primary" @click="submitClientAcceptanceOrder">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="orderVisible">
      <img width="100%" :src="orderImageUrl">
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { deleteProject, putProject } from "@/utils/api";
import { requestUrl } from "@/default";
import { judgePurview } from "@/utils/util";
import { intervalTime } from "@/utils/time";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "projectModule"
);
let flag = false;
export default {
  data() {
    return {
      companyAcceptanceOrderVisible: false,
      clientAcceptanceOrderVisible: false,
      requestUrl,
      qrcodeVisible: false,
      labelWidth: "100px",
      qrcode: {},
      companyAcceptanceOrder: [],
      clientAcceptanceOrder: [],
      // eslint-disable-next-line
      _id: "",
      orderVisible: false,
      orderImageUrl: ""
    };
  },
  computed: {
    ...mapState(["project"]),
    judgePurview
  },
  methods: {
    ...mapMutations([
      "setUpdateProjectVisible",
      "setUpdateProjectInfo",
      "set_id"
    ]),
    ...mapActions(["getProjectList"]),
    handlePictureCardPreview(file) {
      this.orderImageUrl = file.url;
      this.orderVisible = true;
    },
    //判断验收单数组中是否有数据
    isHaveOrder(arr) {
      if (arr.length > 0) {
        return false;
      } else {
        return true;
      }
    },
    acceptance(data) {
      if (flag) {
        return;
      }
      if (
        data.companyAcceptanceOrder.length <= 0 ||
        data.clientAcceptanceOrder.length <= 0
      ) {
        this.$message({
          showClose: true,
          message: "请上传，公司验收单/客户验收单，后再进行验收"
        });
        return;
      }
      this.$confirm("确认验收此项目?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          flag = true;
          putProject(data._id, { state: 1 }).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.getProjectList();
            } else {
              type = "error";
            }
            this.$message({
              showClose: true,
              message: data.message,
              type
            });
            this.reset();
            this.clientAcceptanceOrderVisible = false;
          });
        })
        .catch(() => {
          return;
        });
    },
    submitCompanyAcceptanceOrder() {
      if (flag) {
        return;
      }
      let { _id, companyAcceptanceOrder } = this;
      flag = true;
      putProject(_id, { companyAcceptanceOrder }).then(data => {
        flag = false;
        let type;
        if (data.status === 1) {
          type = "success";
          this.getProjectList();
        } else {
          type = "error";
        }
        this.$message({
          showClose: true,
          message: data.message,
          type
        });
        this.reset();
        this.companyAcceptanceOrderVisible = false;
      });
    },
    submitClientAcceptanceOrder() {
      if (flag) {
        return;
      }
      let { _id, clientAcceptanceOrder } = this;
      flag = true;
      putProject(_id, { clientAcceptanceOrder }).then(data => {
        flag = false;
        let type;
        if (data.status === 1) {
          type = "success";
          this.getProjectList();
        } else {
          type = "error";
        }
        this.$message({
          showClose: true,
          message: data.message,
          type
        });
        this.reset();
        this.clientAcceptanceOrderVisible = false;
      });
    },
    reset() {
      let {
        uploadCompanyAcceptanceOrder,
        uploadClientAcceptanceOrder
      } = this.$refs;
      this.companyAcceptanceOrder = [];
      this.clientAcceptanceOrder = [];
      if (uploadCompanyAcceptanceOrder) {
        uploadCompanyAcceptanceOrder.clearFiles();
      }
      if (uploadClientAcceptanceOrder) {
        uploadClientAcceptanceOrder.clearFiles();
      }
    },

    //上传公司验收单成功执行操作
    uploadCompanyAcceptanceOrder(response) {
      if (response.status === 1) {
        this.companyAcceptanceOrder.push({
          name: response.filename,
          url: `${requestUrl}/upload/${response.filename}`
        });
      }
    },
    //删除公司验收单后执行操作
    removeCompanyAcceptanceOrder(file, fileList) {
      this.companyAcceptanceOrder.forEach((item, index) => {
        if (file.name === item.name) {
          this.companyAcceptanceOrder.splice(index, 1);
          return;
        }
      });
    },
    //上传用户验收单成功执行操作
    uploadClientAcceptanceOrder(response) {
      if (response.status === 1) {
        this.clientAcceptanceOrder.push({
          name: response.filename,
          url: `${requestUrl}/upload/${response.filename}`
        });
      }
    },
    //删除公司验收单后执行操作
    removeClientAcceptanceOrder(file, fileList) {
      this.clientAcceptanceOrder.forEach((item, index) => {
        if (file.name === item.name) {
          this.clientAcceptanceOrder.splice(index, 1);
          return;
        }
      });
    },

    formatTime(time) {
      return parseInt(intervalTime(time).day);
    },
    dayState(day, type) {
      let str = "";
      if (type === "class") {
        if (day <= 10 && day > 0) {
          str = "warning";
        } else if (day <= 0) {
          str = "error";
        }
      } else {
        if (day === 0) {
          str = "今天验收";
        } else if (day <= 0) {
          str = `${day}天`;
        } else {
          str = `${day}天`;
        }
      }
      return str;
    },

    //查看PDF
    viewPDF(pdfName) {
      window.open(`${requestUrl}/PDF.html?fileName=${pdfName}`);
    },
    //查看二维码
    viewQRCode(pdfName) {
      this.qrcodeVisible = true;
      this.$nextTick(function() {
        this.$refs.qrcode.innerHTML = "";
        this.qrcode = new QRCode("qrcode", {
          width: 200,
          height: 200,
          text: `${requestUrl}/PDF.html?fileName=${pdfName}` // 二维码内容
        });
      });
    },
    //删除项目
    removeProject(_id) {
      if (flag) {
        return;
      }
      this.$confirm("此操作将永久删除该条数据, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          flag = true;
          deleteProject(_id).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.getProjectList();
            } else {
              type = "error";
            }
            this.$message({
              showClose: true,
              message: data.message,
              type
            });
          });
        })
        .catch(() => {
          return;
        });
    },
    updateProject(data) {
      this.setUpdateProjectVisible(true);
      this.set_id(data._id);
      let newData = { ...data };
      delete newData._id;
      this.setUpdateProjectInfo(newData);
    }
  },
  watch: {
    companyAcceptanceOrderVisible(newValue) {
      if (!newValue) {
        this.reset();
      }
    },
    ClientAcceptanceOrder(newValue) {
      if (!newValue) {
        this.reset();
      }
    }
  },
  created() {
    this.getProjectList();
  }
};
</script>

<style scoped>
#qrcode {
  display: flex;
  justify-content: center;
}
.warning {
  color: #e6a23c;
}

.error {
  color: #f56c6c;
}

.success {
  color: #67c23a;
}

.el-input {
  width: 360px;
}

.el-form {
  padding-left: 8px;
  padding-right: 68px;
}

.el-upload {
  display: block;
}
</style>