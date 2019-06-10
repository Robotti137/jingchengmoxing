<template>
  <div>
    <!-- 列表 -->
    <el-table :data="project" stripe style="width: 100%">
      <el-table-column prop="create_time" label="创建时间" width="180"></el-table-column>
      <el-table-column prop="projectName" label="项目名" width="180"></el-table-column>
      <el-table-column label="剩余验收天数">
        <template slot-scope="scope">
          <span
            :class="dayState(formatTime(scope.row.end_time),'class')"
          >{{dayState(formatTime(scope.row.end_time),'')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="salesman" label="业务员" width="180"></el-table-column>
      <el-table-column label="文档" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="viewPDF(scope.row.pdfName)">查看</el-button>
          <el-button type="text" size="mini" @click="viewQRCode(scope.row.pdfName)">二维码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="公司验收单" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="viewPDF(scope.row.pdfName)">查看</el-button>
          <el-button type="text" size="mini" @click="viewQRCode(scope.row.pdfName)">修改</el-button>
        </template>
      </el-table-column>
      <el-table-column label="客户验收单" width="180">
        <template slot-scope="scope">
          <el-button type="text" size="mini" @click="viewPDF(scope.row.pdfName)">查看</el-button>
          <el-button type="text" size="mini" @click="viewQRCode(scope.row.pdfName)">二维码</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="success" plain size="mini">验收</el-button>
          <el-button type="primary" plain size="mini" @click="updateProject(scope.row)">修改</el-button>
          <el-button type="danger" plain size="mini" @click="removeProject(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="qrcodeVisible" width="30%" center>
      <div id="qrcode" ref="qrcode"></div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { deleteProject } from "@/utils/api";
import { requestUrl } from "@/default";
import { getFormatTime, intervalTime, transformTimestamp } from "@/utils/time";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "projectModule"
);
let flag = false;
export default {
  data() {
    return {
      qrcodeVisible: false,
      qrcode: {}
    };
  },
  computed: {
    ...mapState(["project"])
  },
  methods: {
    ...mapMutations([
      "setUpdateProjectVisible",
      "setUpdateProjectInfo",
      "set_id"
    ]),
    ...mapActions(["getProjectList"]),
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
    viewPDF(pdfName) {
      window.open(`${requestUrl}/PDF.html?fileName=${pdfName}`);
    },
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
</style>
