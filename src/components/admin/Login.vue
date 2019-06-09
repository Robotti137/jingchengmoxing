<template>
  <div class="login-background">
    <div class="login-container" @keyup.enter="submitForm('ruleForm')">
      <el-card class="box-card" shadow="always">
        <p class="login-title">
          <span>精诚模型项目后台管理系统</span>
        </p>
        <el-form
          :model="ruleForm"
          status-icon
          :rules="rules"
          ref="ruleForm"
          label-width="100px"
          class="demo-ruleForm"
        >
          <el-form-item label="用户名" prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              autocomplete="off"
              class="login-input"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              autocomplete="off"
              class="login-input"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm('ruleForm')" class="login-btn">提交</el-button>
            <el-button type="info" @click="guestLogin">来宾入口</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>
import { userByLogin } from "@/utils/api";
import { usernameReg } from "@/utils/reg";
import { Message } from "element-ui";
import { setTimeout } from "timers";
export default {
  data() {
    let validateUsername = (rule, value, callback) => {
      if (!value) {
        callback(new Error("用户名不能为空"));
      } else if (!usernameReg.test(value)) {
        callback(new Error("用户名不符合规则，4-16位支持数字字母_-"));
      } else {
        callback();
      }
    };
    let validatePassword = (rule, value, callback) => {
      if (!value) {
        callback(new Error("请输入密码"));
      } else if (value.length < 6) {
        callback(new Error("密码不得小于六位"));
      } else {
        callback();
      }
    };
    return {
      ruleForm: {
        username: "",
        password: ""
      },
      rules: {
        username: [{ validator: validateUsername, trigger: "blur" }],
        password: [{ validator: validatePassword, trigger: "blur" }]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          userByLogin(this.ruleForm).then(data => {
            if (data.token && data.status === 1) {
              let userinfo = {
                token: data.token,
                username: data.username,
                purview: data.purview
              };
              sessionStorage.setItem("jcmx-userinfo", JSON.stringify(userinfo));
              this.$message({
                message: "登陆成功",
                type: "success",
                center: true
              });
              setTimeout(() => {
                this.$router.replace("/admin/manage");
              }, 300);
            } else {
              this.$message({
                message: "登陆失败",
                type: "error",
                center: true
              });
            }
          });
        }
      });
    },
    guestLogin() {
      let guest = {
        username: "来宾用户"
      };
      sessionStorage.setItem("jcmx-userinfo", JSON.stringify(guest));
      this.$router.replace("/admin/manage");
    }
  },
  components: {
    Message
  }
};
</script>

<style scoped>
.login-background {
  height: 100%;
  background: url("../../assets/img/background_img1.png") no-repeat center top;
  background-size: 100% 100%;
}

.login-container {
  margin: 0 auto;
  width: 480px;
  padding-top: 12rem;
}

.box-card {
  width: 480px;
  background-color: rgba(255, 255, 255, 0.8);
}

.login-input {
  width: 280px;
}

.login-btn {
  margin-left: 40px;
}

.login-title {
  margin: 0 0 16px 0;
  text-align: center;
}

.login-title > span {
  font-size: 20px;
  font-weight: bold;
}
</style>