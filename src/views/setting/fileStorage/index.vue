<template>
    <div class="app-container">
        <el-card class="box-card" v-loading="loading">
                <el-form ref="form" label-width="125px">
                    <el-form-item label="文件存储" prop="cdn_static_root">
                        <el-select v-model="type" placeholder="文件存储">
                            <el-option
                                    v-for="(item,index) in typeList"
                                    :key="index"
                                    :label="item.name"
                                    :value="index">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitForm()" v-btn-permission="71">保存</el-button>
                    </el-form-item>
                </el-form>
        </el-card>
    </div>
</template>

<script>
  import { fileStorage, fileStoragePost } from '@/api/admin/Setting'
  export default {
    data() {
      return {
        loading: true,
        type: '',
        typeList: {},
        activeName: 'fileStorage'
      }
    },
    created() {
      this.fileStorage()
    },
    methods: {
      fileStorage() {
        this.loading = true
        fileStorage().then(response => {
          this.typeList = response.data.storage.storages
          this.type = response.data.storage.type
        }).finally(() => {
          this.loading = false
        })
      },
      submitForm() {
        this.loading = true
        fileStoragePost(this.type).then(response => {
          this.$message({
            message: response.msg,
            type: 'success'
          })
          this.fileStorage()
        }).finally(() => {
          this.loading = false
        })
      }
    }
  }
</script>