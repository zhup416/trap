<template>
  <div class="dashboard-container">
    <el-row>
      <el-card class="box-card" v-loading="loading">
        <div slot="header" class="clearfix">
          <span>系统信息{{code}}</span>
        </div>
        <div>
          <table cellpadding="0" cellspacing="0" class="system_table">
            <tbody>
              <tr>
                <td class="gray_bg">服务器操作系统:</td>
                <td>{{sysInfo.os}}</td>
                <td class="gray_bg">服务器域名/IP:</td>
                <td>{{sysInfo.domain}} [{{sysInfo.ip}}]</td>
              </tr>
              <tr>
                <td class="gray_bg">服务器环境:</td>
                <td>{{sysInfo.web_server}}</td>
                <td class="gray_bg">PHP 版本:</td>
                <td>{{sysInfo.phpv}}</td>
              </tr>
              <tr>
                <td class="gray_bg">Mysql 版本:</td>
                <td>{{sysInfo.mysql_version}}</td>
                <td class="gray_bg">GD 版本:</td>
                <td>{{sysInfo.gdinfo}}</td>
              </tr>
              <tr>
                <td class="gray_bg">文件上传限制:</td>
                <td>{{sysInfo.fileupload}}</td>
                <td class="gray_bg">最大占用内存:</td>
                <td>{{sysInfo.memory_limit}}</td>
              </tr>
              <tr>
                <td class="gray_bg">最大执行时间:</td>
                <td>{{sysInfo.max_ex_time}}</td>
                <td class="gray_bg">安全模式:</td>
                <td>{{sysInfo.safe_mode}}</td>
              </tr>
              <tr>
                <td class="gray_bg">Zlib支持:</td>
                <td>{{sysInfo.zlib}}</td>
                <td class="gray_bg">Curl支持:</td>
                <td>{{sysInfo.curl}}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { sysInfo } from '@/api/admin/Main'
import * as dd from 'dingtalk-jsapi'
import axios from 'axios'
import { getToken, setToken, setDeviceType } from '@/utils/auth'
// import { getInfo } from '@/api/user/login'
export default {
  name: 'dashboard',
  data() {
    return {
      loading: true,
      code: '',
      corpId: 'dingc346460e0977f2b735c2f4657eb6378f',
      sysInfo: {
        'os': '',
        'zlib': '',
        'safe_mode': '',
        'timezone': '',
        'curl': '',
        'web_server': '',
        'phpv': '',
        'ip': '',
        'fileupload': '',
        'max_ex_time': '',
        'set_time_limit': null,
        'domain': '',
        'memory_limit': '',
        'mysql_version': '',
        'gdinfo': ''
      }
    }
  },
  created() {
    // alert(window.location.href)
    this.avoidAuthorized()
    this.getSysInfo()
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
                const data = res.data.data
                setToken(data.token)
                _this.$store.commit('SET_TOKEN', data.token)
                setDeviceType('web')
                _this.$store.commit('SET_DEVICE_TYPE', 'web')
                _this.getUserInfo()
                // alert('res:' + res.data.data.token)
              }).catch(res => {
                alert('err:' + res)
              })
          }
        })
      })
    },
    getSysInfo() {
      this.loading = true
      sysInfo().then(response => {
        this.sysInfo = response.data
      }).finally(() => {
        this.loading = false
      })
    },
    getUserInfo() {
      const token = getToken()
      alert(token)
    //   getInfo(token).then(response => {
    //     alert('haha')
    //     const data = response.data
    //     this.$store.commit('SET_NAME', data.name)
    //     this.$store.commit('SET_AVATAR', data.avatar)
    //     this.$store.commit('SET_AUTH_RULES', data.auth_rules ? data.auth_rules : [])
    //     this.$store.commit('SET_MENUS', data.menus ? data.menus : {})
    //     this.$store.commit('SET_IS_NULL_RULES', data.auth_rules ? (data.auth_rules.length === 0 ? 1 : 0) : 1)
    //     this.getSysInfo()
    //   }).catch(res => {
    //     alert('err:' + res)
    //   })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
  }
}

.system_table {
  border-collapse: collapse;
  border: none;
  width: 100%;
}
.system_table td {
  height: 40px;
  line-height: 40px;
  font-size: 12px;
  color: #454545;
  border: 1px solid #dcdcdc;
  width: 32%;
  padding-left: 3%;
}
.system_table td.gray_bg {
  background: #f7f7f7;
  width: 18%;
}
</style>
