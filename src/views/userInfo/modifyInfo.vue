<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
      <el-form ref="form" :model="form" label-width="80px" size="mini" label-position="top">
        <el-form-item label="昵称">
          <el-col :span="10">
            <el-input v-model="form.user_nickname"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="性别">
          <el-col :span="10">
            <el-select v-model="form.sex" placeholder="请选择">
              <el-option
                  v-for="item in sexStatus"
                  :key="item.code"
                  :label="item.desc"
                  :value="item.code">
              </el-option>
            </el-select>
          </el-col>
        </el-form-item>
        <el-form-item label="生日">
          <el-col :span="10">
            <el-date-picker
                v-model="form.birthday"
                type="date"
                placeholder="选择日期"
                value-format="timestamp">
            </el-date-picker>
          </el-col>
        </el-form-item>
        <el-form-item label="个人网址">
          <el-col :span="10">
            <el-input v-model="form.user_url"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="个性签名">
          <el-col :span="10">
            <el-input v-model="form.signature"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="saveUserInfo">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import { userInfoPost, userInfo } from '@/api/admin/User'
  export default {
    data() {
      return {
        loading: true,
        form: {
          'user_nickname': '',
          'sex': '',
          'birthday': '',
          'user_url': '',
          'signature': ''
        },
        sexStatus: [{
          code: 0,
          desc: '保密'
        }, {
          code: 1,
          desc: '男'
        }, {
          code: 2,
          desc: '女'
        }]
      }
    },
    created() {
      this.getUserInfo()
    },
    methods: {
      getUserInfo() {
        this.loading = true
        userInfo().then(response => {
          if (response.data && response.data.birthday) {
            response.data.birthday = response.data.birthday * 1000
          }
          this.form = response.data
        }).finally(() => {
          this.loading = false
        })
      },
      saveUserInfo() {
        this.loading = true
        const userData = {}
        Object.assign(userData, this.form)
        if (this.form && this.form.birthday) {
          userData.birthday = userData.birthday / 1000
        }
        userInfoPost(userData).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>
<style>
  .el-form--label-top .el-form-item__label {
    padding-bottom: 0;
    line-height: 30px;
  }
</style>