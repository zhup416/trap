<template>
  <div class="app-container">
    <el-card class="box-card" v-loading="loading">
    <el-form ref="form" :model="upload_setting" label-width="80px" size="mini" label-position="top" >
      <el-form-item label="最大同时上传文件数" >
        <el-col :span="10">
        <el-input v-model="upload_setting.max_files"></el-input>
        </el-col>
        <el-col :span="24">
          <span>多文件上传时,用户能最大同时上传文件数,默认20个</span>
        </el-col>
      </el-form-item>
      <el-form-item label="文件分块上传分块大小">
        <el-col :span="10">
          <el-input v-model="upload_setting.chunk_size"></el-input>
        </el-col>
        <el-col :span="24">
          <span>文件上传采用分块上传,文件分块大小默认512KB,可以根据服务器最大上传限制设置此数值</span>
        </el-col>
      </el-form-item>
      <el-form-item label="图片文件">
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.image.upload_max_filesize"></el-input>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.image.extensions"></el-input>
        </el-col>
        <el-col :span="24">
          <span>允许上传大小默认为10240KB,1M=1024KB，允许上传格式默认为jpg,jpeg,png,gif,bmp</span>
        </el-col>
      </el-form-item>

      <el-form-item label="视频文件">
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.video.upload_max_filesize"></el-input>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.video.extensions"></el-input>
        </el-col>
        <el-col :span="24">
          <span>允许上传大小默认为102400KB,1M=1024KB，允许上传格式默认为mp4,avi,wmv,rm,rmvb,mkv</span>
        </el-col>
      </el-form-item>
      <el-form-item label="音频文件">
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.audio.upload_max_filesize"></el-input>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.audio.extensions"></el-input>
        </el-col>
        <el-col :span="24">
          <span>允许上传大小默认为10240KB,1M=1024KB，允许上传格式默认为mp3,wma,wav</span>
        </el-col>
      </el-form-item>
      <el-form-item label="附件">
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.file.upload_max_filesize"></el-input>
        </el-col>
        <el-col class="line" :span="1">&nbsp;</el-col>
        <el-col :span="10">
          <el-input v-model="upload_setting.file_types.file.extensions"></el-input>
        </el-col>
        <el-col :span="24">
          <span>允许上传大小默认为10240KB,1M=1024KB，允许上传格式默认为除以上文档类型以外的其它常用文件,如：txt,pdf,doc,docx,xls,xlsx,ppt,pptx,zip,rar</span>
        </el-col>
      </el-form-item>
      <el-form-item size="large">
        <el-button type="primary" @click="saveUploadSetting" v-btn-permission="75">保存</el-button>
      </el-form-item>
    </el-form>
    </el-card>
  </div>
</template>

<script>
  import { upload, uploadPost } from '@/api/admin/Setting'
  export default {
    data() {
      return {
        loading: true,
        upload_setting: {
          'file_types': {
            'image': {
              'upload_max_filesize': '',
              'extensions': ''
            },
            'video': {
              'upload_max_filesize': '',
              'extensions': ''
            },
            'audio': {
              'upload_max_filesize': '',
              'extensions': ''
            },
            'file': {
              'upload_max_filesize': '',
              'extensions': ''
            }
          },
          'chunk_size': 0,
          'max_files': 0,
          'upload_max_filesize': {
            'jpg': 0,
            'jpeg': 0,
            'png': 0,
            'gif': 0,
            'bmp4': 0,
            'mp4': 0,
            'avi': 0,
            'wmv': 0,
            'rm': 0,
            'rmvb': 0,
            'mkv': 0,
            'mp3': 0,
            'wma': 0,
            'wav': 0,
            'txt': 0,
            'pdf': 0,
            'doc': 0,
            'docx': 0,
            'xls': 0,
            'xlsx': 0,
            'ppt': 0,
            'pptx': 0,
            'zip': 0,
            'rar': 0
          }
        }
      }
    },
    created() {
      this.uploadSetting()
    },
    methods: {
      onSubmit() {
        console.log('submit!')
      },
      uploadSetting() {
        this.loading = true
        upload().then(response => {
          if (response.data) {
            this.upload_setting = response.data.upload_setting
          }
        }).finally(() => {
          this.loading = false
        })
      },
      saveUploadSetting() {
        this.loading = true
        uploadPost(this.upload_setting).then(response => {
          this.$message({
            type: 'success',
            message: '提交成功!'
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