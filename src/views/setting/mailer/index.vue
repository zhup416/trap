<template>
  <div class="app-container">
    <el-tabs style='margin-top:15px;' v-model="activeName" type="border-card" v-loading="loading" @tab-click="tabClick">
      <el-tab-pane label="邮箱配置" name="mailerSetting">
        <el-form ref="form" :model="form" label-width="140px" size="mini" label-position="right">
          <el-form-item label="发件人：">
            <el-col :span="10">
              <el-input v-model="form.from_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮箱地址：">
            <el-col :span="10">
              <el-input v-model="form.from"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="SMTP服务器：">
            <el-col :span="10">
              <el-input v-model="form.host"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="连接方式：">
            <el-col :span="10">
              <el-select v-model="form.smtp_secure" >
                <el-option label="默认" value=""></el-option>
                <el-option label="ssl" value="ssl"></el-option>
                <el-option label="tls" value="tls"></el-option>
              </el-select>
            </el-col>
          </el-form-item>
          <el-form-item label="SMTP服务器端口：">
            <el-col :span="10">
              <el-input v-model="form.port"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="发件箱帐号：">
            <el-col :span="10">
              <el-input v-model="form.username"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="发件箱密码：">
            <el-col :span="10">
              <el-input v-model="form.password"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item size="large" >
            <el-button type="primary" @click="saveMail" v-btn-permission="14">保存</el-button>
            <el-button type="warning" @click="testMail" v-btn-permission="17">测试邮件</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="数字验证码邮件模板" name="templateVerificationCode">
        <el-form ref="templateForm" :model="templateForm" label-width="140px" size="mini" label-position="right">
          <el-form-item label="邮件标题：">
            <el-col :span="10">
              <el-input v-model="templateForm.subject"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="邮件模板：">
            <el-col :span="24">
              <tinymce :height="300" v-model="templateForm.template"></tinymce>
            </el-col>
            <el-col :span="24">
              <span style="color: #ffb752;">请用{$code}代替数字验证码</span>
            </el-col>
          </el-form-item>
          <el-form-item size="large">
            <el-button type="primary" @click="saveTemplate" :loading="templateLoading" v-btn-permission="16">保存</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="发送测试邮件" :visible.sync="dialogFormVisible" @close="handleClose" >
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="top" style='width: 550px; margin-left:50px;'>
        <el-form-item label="收件箱" prop="to">
          <el-input v-model="temp.to"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="subject">
          <el-input v-model="temp.subject"></el-input>
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input type="textarea" v-model="temp.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sendMail" :loading="sendLoading" v-btn-permission="17">发送</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Tinymce from '@/components/Tinymce'
  import { index, indexPost, test, template, templatePost } from '@/api/admin/Mailer'
  export default {
    components: { Tinymce },
    data() {
      return {
        activeName: 'mailerSetting',
        loading: true,
        form: {
          'from_name': '',
          'from': '',
          'host': '',
          'smtp_secure': '',
          'port': '',
          'username': '',
          'password': ''
        },
        dialogFormVisible: false,
        temp: {
          to: '',
          subject: '',
          content: ''
        },
        rules: {
          to: [
            { required: true, message: '收件箱不能为空', trigger: 'blur' },
            { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }
          ],
          subject: [
            { required: true, message: '标题不能为空', trigger: 'blur' }
          ],
          content: [
            { required: true, message: '内容不能为空', trigger: 'blur' }
          ]
        },
        sendLoading: false,
        templateForm: {
          subject: '',
          template: '',
          template_key: 'verification_code'
        },
        templateLoading: false
      }
    },
    created() {
      this.getMailerInfo()
    },
    methods: {
      tabClick(tab) {
        if (tab.name === 'templateVerificationCode') {
          this.getTemplateInfo()
        } else if (tab.name === 'mailerSetting') {
          this.getMailerInfo()
        }
      },
      getMailerInfo() {
        this.loading = true
        index().then(response => {
          if (response.data) {
            this.form = response.data
          }
        }).finally(() => {
          this.loading = false
        })
      },
      saveMail() {
        this.loading = true
        indexPost(this.form).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        }).finally(() => {
          this.loading = false
        })
      },
      testMail() {
        this.dialogFormVisible = true
      },
      resetTemp() {
        this.temp = {
          to: '',
          subject: '',
          content: ''
        }
      },
      handleClose() {
        this.resetTemp()
      },
      sendMail() {
        this.$refs.dataForm.validate((valid) => {
          if (valid) {
            this.sendLoading = true
            test(this.temp).then(response => {
              this.resetTemp()
              this.$message({
                message: response.msg,
                type: 'success'
              })
            }).catch((e) => {
              console.info(e)
            }).finally(() => {
              this.sendLoading = false
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      getTemplateInfo() {
        this.loading = true
        template().then(response => {
          this.templateForm.subject = response.data.subject
          this.templateForm.template = this.htmlDecodeByRegExp(response.data.template)
        }).catch((e) => {
          console.info(e)
        }).finally(() => {
          this.loading = false
        })
      },
      /* 用正则表达式实现html解码 */
      htmlDecodeByRegExp: function(str) {
        var s = ''
        if (str.length === 0) return ''
        s = str.replace(/&amp;/g, '&')
        s = s.replace(/&lt;/g, '<')
        s = s.replace(/&gt;/g, '>')
        s = s.replace(/&nbsp;/g, ' ')
        s = s.replace(/&#39;/g, "\'")
        s = s.replace(/&quot;/g, '"')
        return s
      },
      saveTemplate() {
        this.templateLoading = true
        templatePost(this.templateForm).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
        }).catch((e) => {
          console.info(e)
        }).finally(() => {
          this.templateLoading = false
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