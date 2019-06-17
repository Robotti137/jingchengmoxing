<template>
  <!-- 列表 -->
  <div>
    <el-table :data="application" stripe style="width: 100%">
      <el-table-column prop="applicationDate" label="申请日期" align="center"></el-table-column>
      <el-table-column prop="projectName" label="项目名" align="center"></el-table-column>
      <el-table-column prop="salesman" label="业务员" align="center"></el-table-column>
      <el-table-column prop="partyAName" label="甲方单位" align="center"></el-table-column>
      <el-table-column prop="partyAPhone" label="甲方电话" align="center"></el-table-column>
      <el-table-column label="预估价格(万元)" width="120" align="center">
        <template slot-scope="scope">{{formatEstimatedPrice(scope.row.estimatedPrice)}}</template>
      </el-table-column>
      <el-table-column label="所属部门" align="center">
        <template slot-scope="scope">{{formatDepartment(scope.row.department)}}</template>
      </el-table-column>
      <el-table-column label="风险评估(成交率)" width="130" align="center">
        <template slot-scope="scope">{{formatTurnoverRate(scope.row.turnoverRate)}}</template>
      </el-table-column>
      <el-table-column label="项目协助内容" width="110" align="center">
        <template slot-scope="scope">{{formatAssistContent(scope.row.assistContent)}}</template>
      </el-table-column>
      <el-table-column label="效果图制作" align="center">
        <template slot-scope="scope">{{formatEffectProduction(scope.row.effectProduction)}}</template>
      </el-table-column>
      <el-table-column label="签字" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="mini"
            @click="signatureVisible = true;id = scope.row._id;item = scope.row"
          >查看</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button type="primary" plain size="mini" @click="updateApplication(scope.row)">修改</el-button>
          <el-button type="danger" plain size="mini" @click="removeApplication(scope.row._id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog title="签字" :visible.sync="signatureVisible" width="570px" center>
      <el-form :model="twoPassword" size="medium">
        <el-form-item label="事业部领导二级密码：" :label-width="labelWidth">
          <div class="flex">
            <el-input
              type="password"
              v-model="twoPassword.causePassword"
              :disabled="formatSignature('causeState')"
            ></el-input>
            <el-button
              v-if="!formatSignature('causeState')"
              type="primary"
              size="mini"
              plain
              class="ml15"
              @click="confirmSignature('causeState',twoPassword.causePassword)"
            >确 定</el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              plain
              class="ml15"
              :disabled="formatSignature('causeState')"
            >已 批</el-button>
          </div>
        </el-form-item>
        <el-form-item label="生产总监二级密码：" :label-width="labelWidth">
          <div class="flex">
            <el-input
              type="password"
              v-model="twoPassword.producePassword"
              :disabled="formatSignature('produceState')"
            ></el-input>
            <el-button
              v-if="!formatSignature('produceState')"
              type="primary"
              size="mini"
              plain
              class="ml15"
              @click="confirmSignature('produceState',twoPassword.producePassword)"
            >确 定</el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              plain
              class="ml15"
              :disabled="formatSignature('causeState')"
            >已 批</el-button>
          </div>
        </el-form-item>
        <el-form-item label="总经理二级密码：" :label-width="labelWidth">
          <div class="flex">
            <el-input
              type="password"
              v-model="twoPassword.directorPassword"
              :disabled="formatSignature('directorState')"
            ></el-input>
            <el-button
              v-if="!formatSignature('directorState')"
              type="primary"
              size="mini"
              plain
              class="ml15"
              @click="confirmSignature('directorState',twoPassword.directorPassword)"
            >确 定</el-button>
            <el-button
              v-else
              type="primary"
              size="mini"
              plain
              class="ml15"
              :disabled="formatSignature('causeState')"
            >已 批</el-button>
          </div>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
/*
estimatedPrice{
    5：≤5，
    10：≤10，
    15：≤15，
    20：≤20，
    25：≤25，
    30：≤30，
    35：≤35，
    36：≥35
}，
department：{
    1：模型事业部，
    2：展览事业部，
    3：动画事业部
}，
turnoverRate：{
    30：≥30%，
    50：≥50%，
    80：≥80%
}，
assistContent：{
    1：方案前期框图，
    2：标书协助，
    3：前期沟通协助，
    4：方案制作
}，
effectProduction：{
    1：粗模(体块)，
    2：半精模，
    3：精模，
    4：高要求精模
}
*/
import { deleteApplication, postSignature } from "@/utils/api";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "applicationModule"
);
let flag = false;
export default {
  data() {
    return {
      signatureVisible: false,
      labelWidth: "160px",
      twoPassword: {
        causePassword: "", //事业部领导二级密码
        producePassword: "", //生产总监二级密码
        directorPassword: "" //总经理二级密码
      },
      id: "",
      item: null
    };
  },
  computed: {
    ...mapState(["application"])
  },
  methods: {
    ...mapMutations([
      "setUpdateApplicationVisible",
      "setUpdateApplicationInfo",
      "setId"
    ]),
    ...mapActions(["getApplicationList"]),
    confirmSignature(role, val) {
      if (flag) {
        return;
      }
      let username = JSON.parse(sessionStorage.getItem("jcmx-userinfo"))
          .username,
        { id } = this,
        obj = {
          id,
          username,
          role,
          twoPassword: val
        };
      flag = true;
      postSignature(obj).then(data => {
        flag = false;
        let type;
        if (data.status === 1) {
          type = "success";
          this.getApplicationList();
          this.signatureVisible = false;
          for (let key in this.twoPassword) {
            this.twoPassword[key] = "";
          }
        } else {
          type = "error";
        }
        this.$message({
          showClose: true,
          message: data.message,
          type
        });
      });
    },
    formatSignature(role) {
      let { item } = this;
      if (!item) {
        return;
      }
      if (item[role] === 1) {
        return true;
      } else {
        return false;
      }
    },
    formatEstimatedPrice(val) {
      let str;
      switch (val) {
        case 5:
          str = "≤5";
          break;
        case 10:
          str = "≤10";
          break;
        case 15:
          str = "≤15";
          break;
        case 20:
          str = "≤20";
          break;
        case 25:
          str = "≤25";
          break;
        case 30:
          str = "≤30";
          break;
        case 35:
          str = "≤35";
          break;
        case 36:
          str = "≥35";
          break;
      }
      return str;
    },
    formatDepartment(val) {
      let str;
      switch (val) {
        case 1:
          str = "模型事业部";
          break;
        case 2:
          str = "展览事业部";
          break;
        case 3:
          str = "动画事业部";
          break;
      }
      return str;
    },
    formatTurnoverRate(val) {
      let str;
      switch (val) {
        case 30:
          str = "≥30%";
          break;
        case 50:
          str = "≥50%";
          break;
        case 80:
          str = "≥80%";
          break;
      }
      return str;
    },
    formatAssistContent(val) {
      let str;
      switch (val) {
        case 1:
          str = "方案前期框图";
          break;
        case 2:
          str = "标书协助";
          break;
        case 3:
          str = "前期沟通协助";
          break;
        case 4:
          str = "方案制作";
          break;
      }
      return str;
    },
    formatEffectProduction(val) {
      let str;
      switch (val) {
        case 1:
          str = "粗模(体块)";
          break;
        case 2:
          str = "半精模";
          break;
        case 3:
          str = "精模";
          break;
        case 4:
          str = "高要求精模";
          break;
      }
      return str;
    },
    removeApplication(id) {
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
          deleteApplication(id).then(data => {
            flag = false;
            let type;
            if (data.status === 1) {
              type = "success";
              this.getApplicationList();
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
    updateApplication(data) {
      this.setUpdateApplicationVisible(true);
      this.setId(data._id);
      let newDate = { ...data };
      delete newDate._id;
      this.setUpdateApplicationInfo(newDate);
    }
  },
  created() {
    this.getApplicationList();
  }
};
</script>

<style scoped>
.el-input {
  width: 300px;
}

.flex {
  display: flex;
}

.ml15 {
  margin-left: 15px;
}
</style>
