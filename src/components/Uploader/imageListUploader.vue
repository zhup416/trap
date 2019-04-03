<template>
        <el-upload
                list-type="picture-card"
                :action="actionURL"
                :with-credentials="true"
                :headers="headers"
                :disabled="disabled"
                :limit="limit"
                :file-list="fileList"
                :before-upload="beforeImageUpload"
                :before-remove="beforeImageRemove"
                :on-success="handleUploadSuccess"
                :on-error="handleUploadError"
                :on-remove="handleRemoveImage"
                :on-exceed="outLimit">
            <i class="el-icon-plus"></i>
        </el-upload>
</template>
<script>
  import { getToken, getDeviceType, TokenKey, DeviceTypeKey } from '@/utils/auth'
  export default {
    name: 'ImageListUploader',
    data() {
      const headers = {}
      headers[TokenKey()] = getToken()
      headers[DeviceTypeKey()] = getDeviceType()
      return {
        actionURL: process.env.BASE_API + '/user/asset/webuploader.html',
        headers: headers
      }
    },
    props: {
      fileList: {
        type: Array,
        default: undefined
      },
      limit: {
        type: Number,
        default: undefined
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    created() {
    },
    methods: {
      handleUploadSuccess(response, file, fileList) {
        this.$emit('on-success', response, file, fileList)
      },
      handleUploadError(err, file, fileList) {
        console.log(err)
        this.$message({
          message: '文件' + file.name + '上传失败！原因：' + err,
          type: 'error'
        })
      },
      beforeImageUpload(file) {
        this.$emit('before-upload', file)
      },
      handleRemoveImage(file, fileList) {
        this.$emit('on-remove', file, fileList)
      },
      outLimit(files, fileList) {
        this.$message({
          message: '最多上传' + this.limit + '张图片',
          type: 'error'
        })
      },
      beforeImageRemove(file, fileList) {
        this.$emit('before-remove', file, fileList)
      }
    }
  }
</script>