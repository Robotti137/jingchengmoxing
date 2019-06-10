<template>
  <!-- 修改弹框 -->
  <el-dialog title="新增项目" :visible.sync="updateProjectVisible" width="570px">
    <el-form
      :model="updateProjectInfo"
      :rules="updateProjectRules"
      ref="updateProjectForm"
      size="medium"
    >
      <el-form-item label="项目名称：" :label-width="labelWidth" prop="projectName">
        <el-input v-model="updateProjectInfo.projectName"></el-input>
      </el-form-item>
      <el-form-item label="业务员：" :label-width="labelWidth" prop="salesman">
        <el-input v-model="updateProjectInfo.salesman"></el-input>
      </el-form-item>
      <el-form-item label="验收日期：" :label-width="labelWidth" prop="end_time">
        <el-date-picker
          v-model="updateProjectInfo.end_time"
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
          multiple
          :on-success="updatePDF"
          ref="updateFile"
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
    </div>
  </el-dialog>
</template>

<script>
import { requestUrl } from "@/default";
import { createNamespacedHelpers } from "vuex";
import { getFormatTime, transformTimestamp } from "@/utils/time";
import { putProject } from "@/utils/api";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "projectModule"
);
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
        selectTimestamp;
      if (typeof value === "string") {
        selectTimestamp = transformTimestamp(value).getTime();
      } else {
        selectTimestamp = value.getTime();
      }
      if (selectTimestamp < nowTimestamp) {
        callback(new Error("验收日期不能小于当前日期"));
        return;
      }
      callback();
    };
    return {
      requestUrl,
      labelWidth: "100px",
      updateProjectRules: {
        projectName: [{ validator: validProjectName, trigger: "blur" }],
        salesman: [{ validator: validSalesman, trigger: "blur" }],
        end_time: [{ validator: validEndTime, trigger: "blur" }]
      }
    };
  },
  computed: {
    ...mapState(["updateProjectVisible", "updateProjectInfo", "_id"]),
    updateProjectVisible: {
      get() {
        return this.$store.state.projectModule.updateProjectVisible;
      },
      set(value) {
        this.$store.commit("projectModule/setUpdateProjectVisible", value);
        this.updateProjectInfo.pdfName = "";
        this.$refs.updateFile.clearFiles();
      }
    }
  },
  methods: {
    ...mapMutations(["setUpdateProjectVisible"]),
    ...mapActions(["getProjectList"]),
    updatePDF(response) {
      if (response.status === 1) {
        this.updateProjectInfo.pdfName = response.filename;
      }
    },
    submit() {
      if (flag) {
        return;
      }
      this.$refs.updateProjectForm.validate(valid => {
        if (!valid) {
          return;
        }
        let { updateProjectInfo } = this;
        let sendDate = {
          ...updateProjectInfo
        };
        if (typeof sendDate.end_time !== "string") {
          sendDate.end_time = getFormatTime(projectInfo.end_time);
        }
        flag = true;
        putProject(this._id, sendDate).then(data => {
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
          this.setUpdateProjectVisible(false);
        });
      });
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
