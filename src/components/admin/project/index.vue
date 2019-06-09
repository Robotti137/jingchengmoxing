<template>
  <div>
    <div style="display:flex;height:40px;">
      <!-- 新增 -->
      <el-button
        size="medium"
        type="primary"
        @click="dialogFormVisible = true"
        :disabled="judgePurview"
        style="height:40px;"
      >新增项目</el-button>
      <!-- 搜索 -->
      <el-form :inline="true" :model="search" style="margin-left:40px;">
        <el-form-item label="项目名称">
          <el-input
            v-model="search.projectName"
            placeholder="项目名称"
            @keyup.enter.native="searchProject"
          ></el-input>
        </el-form-item>
        <el-form-item label="项目状态">
          <el-select v-model="search.state" placeholder="项目状态">
            <el-option label="全部" value></el-option>
            <el-option label="未验收" value="0"></el-option>
            <el-option label="已验收" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProject">查询</el-button>
        </el-form-item>
      </el-form>
      <el-dialog title="新增项目" :visible.sync="dialogFormVisible" width="570px">
        <el-form :model="form" :rules="rules" ref="ruleForm">
          <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="projectName">
            <el-input v-model="form.projectName" autocomplete="off" style="width:360px;"></el-input>
          </el-form-item>
          <el-form-item label="验收时间：" :label-width="formLabelWidth" prop="end_time">
            <el-date-picker
              v-model="form.end_time"
              type="date"
              placeholder="选择日期"
              style="width:360px;"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="PDF上传：" :label-width="formLabelWidth">
            <el-upload
              drag
              accept=".pdf, .PDF"
              :action="requestUrl + '/upload'"
              :on-success="uploadSuccess"
              multiple
              :limit="limit"
              ref="elUpload"
            >
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">
                将文件拖到此处，或
                <em>点击上传</em>
              </div>
              <div class="el-upload__tip" slot="tip">只能上传pdf/PDF文件，且只能上传一个</div>
            </el-upload>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addProject">确 定</el-button>
        </div>
      </el-dialog>
    </div>
    <div style="margin-top:20px;">
      <!-- 列表 -->
      <el-table :data="tableData" style="width:100%;">
        <el-table-column prop="create_time" label="创建时间" sortable width="200"></el-table-column>
        <el-table-column prop="end_time" label="验收剩余天数" width="200">
          <template slot-scope="scope">
            <span
              :class="dayState(formatTime(scope.row.end_time),'class')"
            >{{dayState(formatTime(scope.row.end_time),'')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="projectName" label="项目名称"></el-table-column>
        <el-table-column label="文档" width="200">
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="viewPDF(scope)">查看</el-button>
            <el-button type="text" size="mini" @click="viewQRCode(scope)">二维码</el-button>
          </template>
        </el-table-column>
        <el-table-column prop="acceptanceOrderName" label="项目状态">
          <template slot-scope="scope">
            <span
              :class="formatState(scope.row.acceptanceOrderName,'class')"
            >{{formatState(scope.row.acceptanceOrderName)}}</span>
          </template>
        </el-table-column>
        <el-table-column label="验收单">
          <template slot-scope="scope" v-if="scope.row.acceptanceOrderName !== ''">
            <el-button type="text" size="mini" @click="viewOrder(scope)">查看</el-button>
            <el-button
              type="text"
              size="mini"
              @click="updateAcceptanceVisible = true;_id = scope.row._id"
            >修改</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="210">
          <template slot-scope="scope">
            <el-button
              type="success"
              plain
              size="mini"
              @click="acceptanceVisible = true;_id = scope.row._id"
              :disabled="judgePurview || scope.row.acceptanceOrderName !== ''"
            >验收</el-button>
            <el-button
              type="primary"
              plain
              size="mini"
              @click="updateItem(scope)"
              :disabled="judgePurview"
            >修改</el-button>
            <el-button
              type="danger"
              plain
              size="mini"
              @click="removeItem(scope)"
              :disabled="judgePurview"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pagination.currentPage"
          :page-sizes="[10, 15, 20, 30]"
          :page-size="10"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pagination.total"
        ></el-pagination>
      </div>
    </div>
    <!-- 二维码 -->
    <el-dialog title="二维码" :visible.sync="centerDialogVisible" width="30%" center>
      <div id="qrcode" ref="qrcode"></div>
    </el-dialog>
    <!-- 修改 -->
    <el-dialog title="修改项目" :visible.sync="dialogUpdateFormVisible" width="570px">
      <el-form :model="updateForm" :rules="updateRules" ref="updateRuleForm">
        <el-form-item label="项目名称：" :label-width="formLabelWidth" prop="projectName">
          <el-input v-model="updateForm.projectName" autocomplete="off" style="width:360px;"></el-input>
        </el-form-item>
        <el-form-item label="结束时间：" :label-width="formLabelWidth" prop="end_time">
          <el-date-picker
            v-model="updateForm.end_time"
            type="date"
            placeholder="选择日期"
            style="width:360px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="更新PDF：" :label-width="formLabelWidth">
          <el-upload
            drag
            accept=".pdf, .PDF"
            :action="requestUrl + '/upload'"
            :on-success="updateUploadSuccess"
            multiple
            :limit="limit"
            ref="elUploadUpdate"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogUpdateFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateProject">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传验收单 -->
    <el-dialog title="验收项目" :visible.sync="acceptanceVisible" width="570px" @close="closeDialog">
      <el-form>
        <el-form-item label="上传验收单：" :label-width="formLabelWidth">
          <el-upload
            drag
            accept=".png, .PNG, .jpg, .JPG"
            :action="requestUrl + '/upload'"
            :on-success="uploadAcceptanceOrder"
            multiple
            :limit="limit"
            ref="elUploadOrder"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="acceptanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAcceptanceOrder">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 修改验收单 -->
    <el-dialog
      title="验收项目"
      :visible.sync="updateAcceptanceVisible"
      width="570px"
      @close="closeDialog"
    >
      <el-form>
        <el-form-item label="更新验收单：" :label-width="formLabelWidth">
          <el-upload
            drag
            accept=".png, .PNG, .jpg, .JPG"
            :action="requestUrl + '/upload'"
            :on-success="uploadAcceptanceOrder"
            multiple
            :limit="limit"
            ref="elUpdateOrder"
          >
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">
              将文件拖到此处，或
              <em>点击上传</em>
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="updateAcceptanceVisible = false">取 消</el-button>
        <el-button type="primary" @click="updateAcceptanceOrder">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import QRCode from "qrcodejs2";
import { requestUrl } from "@/default";
import { Message } from "element-ui";
import { getFormatTime, intervalTime, transformTimestamp } from "@/utils/time";
import {
  postProject,
  getProject,
  deleteProject,
  putProject
} from "@/utils/api";
let flag = false;
export default {
  data() {
    let validatePjcName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写项目名"));
      } else {
        callback();
      }
    };
    let validateET = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择时间"));
        return;
      }
      let nowTime = transformTimestamp(
        getFormatTime().substring(0, 10)
      ).getTime();
      let endTime;
      if (typeof value === "string") {
        endTime = transformTimestamp(value).getTime();
      } else {
        endTime = value.getTime();
      }
      if (endTime < nowTime) {
        callback(new Error("结束时间不能小于今天"));
      }
      callback();
    };
    return {
      dialogFormVisible: false,
      dialogUpdateFormVisible: false,
      acceptanceVisible: false,
      updateAcceptanceVisible: false,
      _id: "",
      form: {
        projectName: "",
        pdfName: "",
        end_time: "",
        acceptanceOrderName: ""
      },
      acceptanceOrderName: "",
      updateForm: {
        projectName: "",
        pdfName: "",
        end_time: ""
      },
      formLabelWidth: "100px",
      rules: {
        projectName: [{ validator: validatePjcName, trigger: "blur" }],
        end_time: [{ validator: validateET, trigger: "blur" }]
      },
      updateRules: {
        projectName: [{ validator: validatePjcName, trigger: "blur" }],
        end_time: [{ validator: validateET, trigger: "blur" }]
      },
      search: {
        projectName: "",
        state: ""
      },
      limit: 1,
      tableData: [],
      pagination: {},
      centerDialogVisible: false,
      qrcode: null,
      dataItemInfo: {},
      requestUrl
    };
  },
  computed: {
    judgePurview() {
      if (JSON.parse(sessionStorage.getItem("jcmx-userinfo")).purview == 1) {
        return false;
      }
      return true;
    }
  },
  methods: {
    viewOrder(data) {
      window.open(`${requestUrl}/upload/${data.row.acceptanceOrderName}`);
    },
    updateOrder() {},
    formatTime(time) {
      return parseInt(intervalTime(time).day);
    },
    dayState(day, type) {
      let str = "";
      if (type === "class") {
        if (day <= 7 && day > 0) {
          str = "warning";
        } else if (day <= 0) {
          str = "error";
        }
      } else {
        if (day === 0) {
          str = "今天验收";
        } else if (day <= 0) {
          str = "已超时";
        } else {
          str = `${day}天`;
        }
      }
      return str;
    },
    formatState(fileName, type) {
      let str;
      if (type) {
        if (fileName) {
          str = "success";
        } else {
          str = "warning";
        }
      } else {
        if (fileName) {
          str = "已验收";
        } else {
          str = "待验收";
        }
      }
      return str;
    },
    handleSizeChange(val) {
      this.pagination.rows = parseInt(val);
      this.pagination.currentPage = 1;
      let { currentPage, rows } = this.pagination;
      this.getProjectData({ currentPage, rows });
    },
    handleCurrentChange(val) {
      this.pagination.currentPage = parseInt(val);
      let { currentPage, rows } = this.pagination;
      this.getProjectData({ currentPage, rows });
    },
    getProjectData(pagination = {}) {
      if (flag) {
        return;
      }
      flag = true;
      getProject(pagination).then(data => {
        flag = false;
        this.tableData = data.data;
        this.pagination = data.pagination;
      });
    },
    addProject() {
      if (flag) {
        return;
      }
      let { projectName, pdfName, end_time, acceptanceOrderName } = this.form,
        { ruleForm, elUpload } = this.$refs;
      end_time = getFormatTime(end_time);
      ruleForm.validate(valid => {
        if (valid) {
          if (!pdfName) {
            this.$message({
              message: "请上传PDF文件",
              type: "error",
              center: true
            });
            return;
          }
          flag = true;
          postProject({
            projectName,
            pdfName,
            end_time,
            acceptanceOrderName
          }).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.dialogFormVisible = false;
              this.getProjectData();
              ruleForm.resetFields();
              elUpload.clearFiles();
              this.form.pdfName = "";
            } else {
              type = "error";
            }
            this.$message({
              message: data.message,
              type,
              center: true
            });
          });
        }
      });
    },
    uploadSuccess(response) {
      if (response.status === 1) {
        this.form.pdfName = response.filename;
      }
    },
    updateUploadSuccess(response) {
      if (response.status === 1) {
        this.updateForm.pdfName = response.filename;
      }
    },
    uploadAcceptanceOrder(response) {
      if (response.status === 1) {
        this.acceptanceOrderName = response.filename;
      }
    },
    viewPDF(data) {
      window.open(`${requestUrl}/PDF.html?fileName=${data.row.pdfName}`);
    },
    viewQRCode(data) {
      this.centerDialogVisible = true;

      this.$nextTick(function() {
        this.$refs.qrcode.innerHTML = "";
        this.qrcode = new QRCode("qrcode", {
          width: 200,
          height: 200, // 高度
          text: `${requestUrl}/PDF.html?fileName=${data.row.pdfName}` // 二维码内容
          // render: 'canvas' ,   // 设置渲染方式（有两种方式 table和canvas，默认是canvas）
          // background: '#f0f',   // 背景色
          // foreground: '#ff0'    // 前景色
        });
      });
    },
    removeItem(item) {
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
          deleteProject(item.row._id).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.tableData.splice(item.$index, 1);
            } else {
              type = "error";
            }
            this.$message({
              message: data.message,
              type,
              center: true
            });
          });
        })
        .catch(() => {
          return;
        });
    },
    updateItem(data) {
      this.dialogUpdateFormVisible = true;
      this.updateForm.projectName = data.row.projectName;
      this.updateForm.pdfName = data.row.pdfName;
      this.updateForm.end_time = data.row.end_time;
      this.dataItemInfo.id = data.row._id;
      this.dataItemInfo.$index = data.$index;
    },
    updateProject() {
      if (flag) {
        return;
      }
      let { updateRuleForm, elUploadUpdate } = this.$refs;
      updateRuleForm.validate(valid => {
        if (valid) {
          let { projectName, pdfName, end_time } = this.updateForm;
          if (typeof end_time !== "string") {
            end_time = getFormatTime(end_time);
          }
          flag = true;
          putProject(this.dataItemInfo.id, {
            projectName,
            pdfName,
            end_time
          }).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.getProjectData();
              this.dialogUpdateFormVisible = false;
              elUploadUpdate.clearFiles();
            } else {
              type = "error";
            }
            this.$message({
              message: data.message,
              type,
              center: true
            });
          });
        }
      });
    },
    updateAcceptanceOrder() {
      if (!this.acceptanceOrderName) {
        this.$message({
          message: "请上传验收单",
          type: "error",
          center: true
        });
        return;
      }
      if (flag) {
        return;
      }
      flag = true;
      putProject(this._id, {
        acceptanceOrderName: this.acceptanceOrderName
      }).then(data => {
        flag = false;
        let type;
        if (data.status === 1) {
          type = "success";
          this.acceptanceVisible = false;
          this.updateAcceptanceVisible = false;
          this.getProjectData();
        } else {
          type = "error";
        }
        this.$message({
          message: data.message,
          type,
          center: true
        });
      });
    },
    closeDialog() {
      let { elUploadOrder, elUpdateOrder } = this.$refs;
      if (elUploadOrder) {
        elUploadOrder.clearFiles();
      }
      if (elUpdateOrder) {
        elUpdateOrder.clearFiles();
      }
      this.acceptanceOrderName = "";
    },
    searchProject() {
      let { search } = this,
        { rows, currentPage } = this.pagination,
        searchObj = {};
      if (search.projectName) {
        searchObj.projectName = search.projectName;
      }
      if (search.state) {
        searchObj.state = search.state;
      }
      this.getProjectData({ searchObj, rows, currentPage });
    }
  },
  created() {
    this.getProjectData();
  },
  components: {
    QRCode
  }
};
</script>

<style scoped>
.customize-el-button {
  background-color: #66cccc;
  border-color: #66cccc;
}
.customize-el-button:hover {
  background-color: #78b9b9;
  border-color: #78b9b9;
}

.customize-el-button:focus {
  background-color: #78b9b9;
  border-color: #78b9b9;
}

#qrcode {
  display: flex;
  justify-content: center;
}
.input-with-select {
  width: 375px;
  margin-left: 10px;
}
.el-select {
  width: 110px;
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
