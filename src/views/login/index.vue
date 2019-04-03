<template>
  <div class="login-container">
    <el-form
      class="login-form"
      autocomplete="on"
      :model="loginForm"
      :rules="loginRules"
      ref="loginForm"
      label-position="left"
    >
      <h3 class="title">ThinkPHP快速开发平台{{code}}</h3>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <svg-icon icon-class="user"/>
        </span>
        <el-input
          name="username"
          type="text"
          v-model="loginForm.username"
          autocomplete="on"
          placeholder="用户名或邮箱"
        />
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <svg-icon icon-class="password"></svg-icon>
        </span>
        <el-input
          name="password"
          :type="pwdType"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.password"
          autocomplete="on"
          placeholder="密码"
        ></el-input>
        <span class="show-pwd" @click="showPwd">
          <svg-icon icon-class="eye"/>
        </span>
      </el-form-item>
      <el-form-item prop="captcha">
        <span class="svg-container">
          <svg-icon icon-class="captcha"/>
        </span>
        <el-input
          name="captcha"
          type="text"
          class="captcha"
          @keyup.enter.native="handleLogin"
          v-model="loginForm.captcha"
          autocomplete="on"
          placeholder="验证码"
        />
        <span class="captcha-img" @click="refreshCaptcha">
          <img :src="captchaUrl" title="换一张">
        </span>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          style="width:100%;"
          :loading="loading"
          @click.native.prevent="handleLogin"
        >登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { captchaUrl } from '@/api/user/login'
import * as dd from 'dingtalk-jsapi'
import axios from 'axios'

export default {
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('密码不能小于6位'))
      } else {
        callback()
      }
    }
    return {
      code: '',
      loginForm: {
        username: '',
        password: '',
        device_type: 'web',
        captcha: ''
      },
      loginRules: {
        username: [{ required: true, message: '用户名不能为空', trigger: 'blur' }],
        password: [{ required: true, trigger: 'blur', validator: validatePass }],
        captcha: [{ required: true, message: '验证码不能为空', trigger: 'blur' }]
      },
      loading: false,
      pwdType: 'password',
      corpId: 'dingc346460e0977f2b735c2f4657eb6378f',
      dingCode: '',
      captchaUrl: ''
    }
  },
  created() {
    // alert(window.location.href)
    this.avoidAuthorized()
    this.getCaptchaUrl()
  },
  methods: {
    avoidAuthorized() {
      const _this = this
      dd.ready(function() {
        dd.runtime.permission.requestAuthCode({
          corpId: _this.corpId, // 企业id
          onSuccess: function(info) {
            // code = info.code // 通过该免登授权码可以获取用户身份
            const code = {
              authCode: info.code
            }
            // alert(info.code)
            _this.code = info.code
            axios.post(`${process.env.BASE_API}/dingpublic/Login/index`, code)
              .then(function(res) {
                // const data = res.data
                // setToken(data.token)
                // this.$store.commit('SET_TOKEN', data.token)
                // setDeviceType('web')
                // this.$store.commit('SET_DEVICE_TYPE', 'web')
                alert('res:' + res.data.data.token)
              }).catch(res => {
                alert('err:' + res)
              })
          }
        })
      })
    },
    getCaptchaUrl() {
      captchaUrl().then(response => {
        this.captchaUrl = response.data + '?height=49&width=150&font_size=22'
      })
    },
    showPwd() {
      if (this.pwdType === 'password') {
        this.pwdType = ''
      } else {
        this.pwdType = 'password'
      }
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('Login', this.loginForm).then(() => {
            this.$router.push({ path: '/' })
          }).catch(() => {
            this.refreshCaptcha()
          }).finally(() => {
            this.loading = false
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    refreshCaptcha() {
      this.captchaUrl = this.captchaUrl + '&time=' + Math.random()
      this.loginForm.captcha = ''
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
$bg: #2d3a4b;
$light_gray: #eee;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      &:-webkit-autofill {
        -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }
  .el-input.captcha {
    width: 264px;
  }
  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;
.login-container {
  position: fixed;
  height: 100%;
  width: 100%;
  background-color: $bg;
  .login-form {
    position: absolute;
    left: 0;
    right: 0;
    width: 520px;
    padding: 35px 35px 15px 35px;
    margin: 120px auto;
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;
    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }
  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
    &_login {
      font-size: 20px;
    }
  }
  .title {
    font-size: 26px;
    font-weight: 400;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
  .captcha-img {
    position: absolute;
    right: 0;
    top: 0;
    cursor: pointer;
    img {
      border-radius: 3px;
    }
  }
}
</style>