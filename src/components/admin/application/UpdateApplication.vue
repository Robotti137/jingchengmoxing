<template>
  <el-dialog title="立项申请" :visible.sync="updateApplicationVisible" width="570px">
    <el-form
      :model="updateApplicationInfo"
      :rules="updateApplicationRules"
      ref="updateApplicationForm"
      size="medium"
    >
      <el-form-item label="项目名称：" :label-width="labelWidth" prop="projectName">
        <div class="left">
          <el-input v-model="updateApplicationInfo.projectName"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="业务员：" :label-width="labelWidth" prop="salesman">
        <div class="left">
          <el-input v-model="updateApplicationInfo.salesman"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="甲方单位名称：" :label-width="labelWidth" prop="partyAName">
        <div class="left">
          <el-input v-model="updateApplicationInfo.partyAName"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="甲方电话：" :label-width="labelWidth" prop="partyAPhone">
        <div class="left">
          <el-input v-model="updateApplicationInfo.partyAPhone" type="tel"></el-input>
        </div>
      </el-form-item>
      <el-form-item label="预估价格(万元)：" :label-width="labelWidth" prop="estimatedPrice">
        <div class="left">
          <el-select
            v-model="updateApplicationInfo.estimatedPrice"
            placeholder="预估价格"
            style="width:360px;"
          >
            <el-option label="≤5" :value="5"></el-option>
            <el-option label="≤10" :value="10"></el-option>
            <el-option label="≤15" :value="15"></el-option>
            <el-option label="≤20" :value="20"></el-option>
            <el-option label="≤25" :value="25"></el-option>
            <el-option label="≤30" :value="30"></el-option>
            <el-option label="≤35" :value="35"></el-option>
            <el-option label="≥35以上" :value="36"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="申请日期：" :label-width="labelWidth" prop="applicationDate">
        <div class="left">
          <el-date-picker
            v-model="updateApplicationInfo.applicationDate"
            type="date"
            placeholder="选择日期"
            style="width:360px;"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="完成日期：" :label-width="labelWidth">
        <div class="left">
          <el-date-picker
            v-model="updateApplicationInfo.completionDate"
            type="date"
            placeholder="选择日期"
            style="width:360px;"
          ></el-date-picker>
        </div>
      </el-form-item>
      <el-form-item label="所属部门：" :label-width="labelWidth" prop="department">
        <div class="left">
          <el-radio-group v-model="updateApplicationInfo.department">
            <el-radio :label="1">模型事业部</el-radio>
            <el-radio :label="2">展览事业部</el-radio>
            <el-radio :label="3">动画事业部</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="风险评估(成交率)：" :label-width="labelWidth" prop="turnoverRate">
        <div class="left">
          <el-radio-group v-model="updateApplicationInfo.turnoverRate">
            <el-radio :label="30">≥30%</el-radio>
            <el-radio :label="50">≥50%</el-radio>
            <el-radio :label="80">≥80%</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="项目协助内容：" :label-width="labelWidth" prop="assistContent">
        <div class="left">
          <el-select
            v-model="updateApplicationInfo.assistContent"
            placeholder="项目协助内容"
            style="width:360px;"
          >
            <el-option label="方案前期框图" :value="1"></el-option>
            <el-option label="标书协助" :value="2"></el-option>
            <el-option label="前期沟通协助" :value="3"></el-option>
            <el-option label="方案制作" :value="4"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="效果图制作：" :label-width="labelWidth" prop="effectProduction">
        <div class="left">
          <el-select
            v-model="updateApplicationInfo.effectProduction"
            placeholder="效果图制作"
            style="width:360px;"
          >
            <el-option label="粗模(体块)" :value="1"></el-option>
            <el-option label="半精模" :value="2"></el-option>
            <el-option label="精模" :value="3"></el-option>
            <el-option label="高要求精模" :value="4"></el-option>
          </el-select>
        </div>
      </el-form-item>
      <el-form-item label="要求说明：" :label-width="labelWidth">
        <div class="left">
          <el-input
            v-model="updateApplicationInfo.claimExplanation"
            type="textarea"
            placeholder="请输入内容"
            style="width:360px;"
          ></el-input>
        </div>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="primary" style="margin-left:24px;" @click="submit">提 交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { putApplication } from "@/utils/api";
import { getFormatTime } from "@/utils/time";
import { createNamespacedHelpers } from "vuex";
const { mapState, mapActions, mapMutations } = createNamespacedHelpers(
  "applicationModule"
);
let flag = false;
export default {
  data() {
    let valid = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请填写/选择"));
      } else {
        callback();
      }
    };
    return {
      labelWidth: "150px",
      updateApplicationRules: {
        projectName: [{ validator: valid, trigger: "blur" }],
        salesman: [{ validator: valid, trigger: "blur" }],
        partyAName: [{ validator: valid, trigger: "blur" }],
        partyAPhone: [{ validator: valid, trigger: "blur" }],
        estimatedPrice: [{ validator: valid, trigger: "change" }],
        department: [{ validator: valid, trigger: "change" }],
        applicationDate: [{ validator: valid, trigger: "blur" }],
        turnoverRate: [{ validator: valid, trigger: "change" }],
        assistContent: [{ validator: valid, trigger: "change" }],
        effectProduction: [{ validator: valid, trigger: "change" }]
      }
    };
  },
  computed: {
    ...mapState(["updateApplicationInfo", "updateApplicationVisible", "id"]),
    updateApplicationVisible: {
      get() {
        return this.$store.state.applicationModule.updateApplicationVisible;
      },
      set(value) {
        this.$store.commit("applicationModule/setUpdateApplicationVisible", value);
      }
    }
  },
  methods: {
    ...mapMutations(["setUpdateApplicationVisible"]),
    ...mapActions(["getApplicationList"]),
    submit() {
      if (flag) {
        return;
      }
      this.$refs.updateApplicationForm.validate(valid => {
        if (!valid) {
          return;
        }
        let { updateApplicationInfo, id } = this,
          newUpdateApplicationInfo = { ...updateApplicationInfo };
        for (let key in newUpdateApplicationInfo) {
          if (typeof newUpdateApplicationInfo[key] === "object") {
            newUpdateApplicationInfo[key] = getFormatTime(
              newUpdateApplicationInfo[key]
            );
          }
        }
        flag = true;
        putApplication(id, newUpdateApplicationInfo).then(data => {
          flag = false;
          let type;
          if (data.status === 1) {
            type = "success";
            this.setUpdateApplicationVisible(false);
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
      });
    }
  }
};
</script>

<style scoped>
.el-input {
  width: 360px;
}

.left {
  float: left;
}
</style>
