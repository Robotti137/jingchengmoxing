<template>
  <div class="login-background">
    <p class="title" style="padding-top:70px;font-size:30px;">精诚模型智慧云平台</p>
    <p class="title" style="margin-top:16px;font-size:18px;">KingSun Cloud Platforms</p>
    <div class="login-container">
      <div
        style="z-index:100;padding:7px;background-color:#fff;font-size:0;box-shadow:4px -4px 4px rgba(40,137,238,.3);"
      >
        <img src="../../../static/img/login_img.png" style="width:360px;height:280px;">
      </div>
      <div
        style="box-sizing:border-box;width:350px;height:270px;padding:20px 40px;background-color:#fff;border:1px solid #e4e4e4"
      >
        <p style="margin:10px 0;text-align:center;font-size:18px;color:#2889ee;">用户登录</p>
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm">
          <el-form-item prop="username">
            <el-input
              type="text"
              v-model="ruleForm.username"
              size="small"
              placeholder="用户名"
              prefix-icon="el-icon-user"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              type="password"
              v-model="ruleForm.password"
              size="small"
              placeholder="密码"
              prefix-icon="el-icon-lock"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button
              type="primary"
              @click="submitForm('ruleForm')"
              class="login-btn"
              round
              size="small"
            >登 录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { userByLogin } from "@/utils/api";
import { usernameReg } from "@/utils/reg";
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
                purview: data.purview,
                _id: data._id
              };
              if (data.approvePurview) {
                userinfo.approvePurview = data.approvePurview;
              }
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
    }
  }
};
</script>

<style>
p {
  margin: 0;
}

.login-background {
  height: 100%;
  background: url("../../../static/img/background_img1.png") no-repeat center
    top;
  background-size: 100% 100%;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 8%;
}

.title {
  margin: 0;
  text-align: center;
  color: #2889ee;
}

.box-card {
  background-color: rgba(255, 255, 255, 0.8);
}

.login-input {
  width: 200px;
}

.login-btn {
  width: 100%;
}

.login-title {
  margin: 0 0 16px 0;
  text-align: center;
}

.el-form-item {
  margin-bottom: 14px;
}

.el-input__inner {
  border-radius: 24px;
}

.el-input__icon{
  color: black;
}
</style>