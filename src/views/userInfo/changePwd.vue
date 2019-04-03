<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
      <el-form ref="form" :model="form" label-width="80px" size="mini" label-position="top">
        <el-form-item label="原密码">
          <el-col :span="10">
            <el-input v-model="form.old_password" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新密码">
          <el-col :span="10">
            <el-input v-model="form.password" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-col :span="10">
            <el-input v-model="form.re_password" type="password"></el-input>
          </el-col>
        </el-form-item>
        <el-form-item size="large">
          <el-button type="primary" @click="savePwd">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>
<script>
  import { passwordPost } from '@/api/admin/Setting'
  export default {
    data() {
      return {
        loading: false,
        form: {
          'old_password': '',
          'password': '',
          're_password': ''
        }
      }
    },
    methods: {
      savePwd() {
        this.loading = true
        passwordPost(this.form).then(response => {
          this.resetForm()
          this.$message({
            message: response.msg,
            type: 'success'
          })
        }).catch((e) => {
          console.info(e)
        }).finally(() => {
          this.loading = false
        })
      },
      resetForm() {
        this.form = {
          'old_password': '',
          'password': '',
          're_password': ''
        }
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