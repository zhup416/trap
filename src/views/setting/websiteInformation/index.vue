<template>
  <div class="app-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" v-loading="loading">

      <el-tab-pane label="网站信息" name="siteInfo">
        <el-form :model="site_info" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="网站名称" prop="site_name">
            <el-input v-model="site_info.site_name"></el-input>
          </el-form-item>
          <el-form-item label="ICP备" prop="site_icp">
            <el-input v-model="site_info.site_icp"></el-input>
          </el-form-item>
          <el-form-item label="公网安备" prop="site_gwa">
            <el-input v-model="site_info.site_gwa"></el-input>
          </el-form-item>
          <el-form-item label="站长邮箱" prop="site_admin_email">
            <el-input v-model="site_info.site_admin_email"></el-input>
          </el-form-item>
          <el-form-item label="统计代码" prop="site_analytics">
            <el-input v-model="site_info.site_analytics"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-btn-permission="71">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="SEO设置" name="seoSetting">
        <el-form :model="site_info" :rules="rules" ref="form" label-width="100px">
          <el-form-item label="SEO标题" prop="site_seo_title">
            <el-input v-model="site_info.site_seo_title"></el-input>
          </el-form-item>
          <el-form-item label="SEO关键字" prop="site_seo_title">
            <el-input v-model="site_info.site_seo_keywords"></el-input>
          </el-form-item>
          <el-form-item label="SEO描述" prop="site_seo_description">
            <el-input type="textarea" v-model="site_info.site_seo_description"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-btn-permission="71">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="用户注册设置" name="userRegSetting">
        <el-form :model="cmf_settings" ref="form" label-width="125px">
          <el-form-item label="是否开放注册" prop="cdn_static_root">
            <el-select v-model="cmf_settings.open_registration" placeholder="用户注册验证">
              <el-option label="是" value="0"></el-option>
              <el-option label="否" value="1"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-btn-permission="71">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>

      <el-tab-pane label="CDN设置" name="cdnSetting">
        <el-form :model="cdn_settings" ref="form" label-width="125px">
          <el-form-item label="静态资源cdn地址" prop="cdn_static_root">
            <el-input v-model="cdn_settings.cdn_static_root"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submitForm()" v-btn-permission="71">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
  import { site, sitePost } from '@/api/admin/Setting'
  export default {
    data() {
      return {
        loading: true,
        activeName: 'siteInfo',
        site_info: {
          site_name: '',
          site_icp: '',
          site_gwa: '',
          site_admin_email: '',
          site_analytics: '',
          site_seo_title: '',
          site_seo_keywords: '',
          site_seo_description: ''
        },
        cdn_settings: {
          cdn_static_root: ''
        },
        cmf_settings: {
          open_registration: ''
        },
        rules: {
          site_name: [
            { required: true, message: '网站名称不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    created() {
      this.site()
    },
    methods: {
      site() {
        this.loading = true
        site().then(response => {
          if (response.data.site_info) {
            this.site_info = response.data.site_info
          }
          if (response.data.cdn_settings) {
            this.cdn_settings = response.data.cdn_settings
          }
          if (response.data.cmf_settings) {
            this.cmf_settings = response.data.cmf_settings
          }
        }).finally(() => {
          this.loading = false
        })
      },
      submitForm() {
        this.$refs.form.validate((valid) => {
          if (valid) {
            this.loading = true
            sitePost(this.site_info, this.cdn_settings, this.cmf_settings).then(response => {
              this.$message({
                message: response.msg,
                type: 'success'
              })
              this.site()
            }).finally(() => {
              this.loading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      }
    }
  }
</script>