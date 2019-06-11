<template>
  <div style="display:flex;">
    <!-- 新增按钮 -->
    <el-button
      size="medium"
      type="primary"
      @click="addProjectVisible = true"
      style="height:40px;"
    >新增项目</el-button>
    <!-- 新增弹框 -->
    <el-dialog title="新增项目" :visible.sync="addProjectVisible" width="570px">
      <el-form :model="projectInfo" :rules="addProjectRules" ref="addProjectForm" size="medium">
        <el-form-item label="项目名称：" :label-width="labelWidth" prop="projectName">
          <el-input v-model="projectInfo.projectName"></el-input>
        </el-form-item>
        <el-form-item label="业务员：" :label-width="labelWidth" prop="salesman">
          <el-input v-model="projectInfo.salesman"></el-input>
        </el-form-item>
        <el-form-item label="验收日期：" :label-width="labelWidth" prop="end_time">
          <el-date-picker
            v-model="projectInfo.end_time"
            type="date"
            placeholder="选择日期"
            style="width:360px;"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="PDF上传：" :label-width="labelWidth">
          <el-upload
            drag
            accept=".pdf, .PDF"
            :action="requestUrl + '/upload'"
            :on-success="uploadPDF"
            multiple
            ref="uploadFile"
            :limit="1"
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
      <div>
        <el-button type="primary" @click="submit">提 交</el-button>
        <el-button @click="reset" style="margin-left:20px">重 置</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { requestUrl } from "@/default";
import { getFormatTime, transformTimestamp } from "@/utils/time";
import { postProject } from "@/utils/api";
import { createNamespacedHelpers } from "vuex";
const { mapActions } = createNamespacedHelpers("projectModule");
let flag = false;
export default {
  data() {
    let validProjectName = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写项目名"));
      } else {
        callback();
      }
    };
    let validSalesman = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写业务员"));
      } else {
        callback();
      }
    };
    let validEndTime = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请选择时间"));
        return;
      }
      let nowTimestamp = transformTimestamp(getFormatTime()).getTime(),
        selectTimestamp = value.getTime();
      if (selectTimestamp < nowTimestamp) {
        callback(new Error("验收日期不能小于当前日期"));
        return;
      }
      callback();
    };
    return {
      requestUrl,
      addProjectVisible: false,
      labelWidth: "100px",
      projectInfo: {
        projectName: "",
        salesman: "",
        end_time: "",
        pdfName: "",
        companyAcceptanceOrder: "",
        clientAcceptanceOrder: "",
        state: 0
      },
      addProjectRules: {
        projectName: [{ validator: validProjectName, trigger: "blur" }],
        salesman: [{ validator: validSalesman, trigger: "blur" }],
        end_time: [{ validator: validEndTime, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions(["getProjectList"]),
    uploadPDF(response) {
      if (response.status === 1) {
        this.projectInfo.pdfName = response.filename;
      }
    },
    submit() {
      if (flag) {
        return;
      }
      this.$refs.addProjectForm.validate(valid => {
        if (!valid) {
          return;
        }
        let { projectInfo } = this;
        if (!projectInfo.pdfName) {
          this.$message({
            showClose: true,
            message: "请上传PDF文件",
            type: "error"
          });
          return;
        }
        let sendDate = {
          ...projectInfo,
          end_time: getFormatTime(projectInfo.end_time)
        };
        flag = true;
        postProject(sendDate).then(data => {
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
          this.addProjectVisible = false;
        });
      });
    },
    reset() {
      let { uploadFile, addProjectForm } = this.$refs;
      addProjectForm.resetFields();
      this.projectInfo.pdfName = "";
      uploadFile.clearFiles();
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 360px;
}

.el-form {
  padding-left: 8px;
  padding-right: 68px;
}
</style>
