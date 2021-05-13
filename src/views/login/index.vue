<template>
  <div class="login">
    <div class="login-form">
      <el-form
        :model="ruleForm"
        :rules="rules"
        :hide-required-asterisk="false"
        ref="ruleForm"
        label-width="54px"
        class="demo-ruleForm"
      >
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="ruleForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWord">
          <el-input v-model="ruleForm.passWord" show-password></el-input>
        </el-form-item>
        <el-form-item label>
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button @click="dialogVisible=true">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog
      title="注册"
      :visible.sync="dialogVisible"
      width="400px"
      center
      custom-class="registeDialog"
    >
      <el-form :model="registerForm" :rules="registerrules" ref="registerForm" label-width="80px">
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="registerForm.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="passWordOne">
          <el-input v-model="registerForm.passWordOne" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="passWordTwo">
          <el-input v-model="registerForm.passWordTwo" type="password"></el-input>
        </el-form-item>
        <!-- <el-form-item label >
          <el-button type="primary" @click="submit">登录</el-button>
          <el-button @click="registerBtn">注册</el-button>
        </el-form-item>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="registerBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { login, register } from "@/api/index.js";
export default {
  data() {
    var validatePass2 = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请再次输入密码"));
      } else if (value !== this.registerForm.passWordOne) {
        callback(new Error("两次输入密码不一致!"));
      } else {
        callback();
      }
    };
    return {
      dialogVisible: false,
      ruleForm: {
        userName: "",
        passWord: ""
      },
      registerForm: {
        userName: "",
        passWordOne: "",
        passWordTwo: ""
      },
      registerrules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 15, message: "长度在 4 到 15 个字符", trigger: "blur" }
        ],
        passWordOne: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "长度在 6 到 15 个字符", trigger: "blur" }
        ],
        passWordTwo: [
          { validator: validatePass2, trigger: "blur", required: true }
        ]
      },
      rules: {
        userName: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 4, max: 15, message: "请重新确认用户名", trigger: "blur" }
        ],
        passWord: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 15, message: "请重新确认密码", trigger: "blur" }
        ]
      }
    };
  },
  methods: {
    submit() {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          let pram = {
            userName: this.ruleForm.userName,
            passWord: this.ruleForm.passWord
          };
          login(pram).then(res => {
            if (res.code == 200) {
              sessionStorage.setItem("token", res.data.token);
              localStorage.setItem(
                "userInfo",
                JSON.stringify(res.data.userInfo)
              );
              this.$router.push({ path: "/home" });
            } else {
              this.$message({
                message: res.message,
                type: "error"
              });
            }
          });
        }
      });
    },
    registerBtn() {
      this.$refs.registerForm.validate(valid => {
        if (valid) {
          let pram = {
            userName: this.registerForm.userName,
            passWord: this.registerForm.passWordOne
          };
          register(pram).then(res => {
            this.dialogVisible = false
            this.$message({
              message: res.message,
              type: "success"
            });
          });
        }
      });
    }
  }
};
</script>
<style lang="scss">
.login {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-form {
    width: 300px;
    height: 200px;
    .el-form-item__label {
      &:before {
        display: none;
      }
    }
  }
}
</style>