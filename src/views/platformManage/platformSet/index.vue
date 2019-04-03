<template>
  <div class="app-container">
    <el-row>
      <el-col :span="5">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>网点切换设置</span>
          </div>
          <div class="">
            <span style="margin-right: 20px">网点切换</span>
            <el-switch
              v-model="netSwitch"
              active-color="#13ce66"
              inactive-color="#ccc">
            </el-switch>
            <el-button style="margin-left: 100px;margin-top:10px" type="primary" size="small" @click="netSwitchHandle(netSwitch)">保存</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>数据大屏设置</span>
          </div>
          <div class="">
            <span style="margin-right: 20px">数据大屏</span>
            <el-switch
              v-model="dataSwitch"
              active-color="#13ce66"
              inactive-color="#ccc">
            </el-switch>
            <el-button style="margin-left:100px;margin-top:10px" type="primary" size="small" @click="dataSwitchHandle(dataSwitch)">保存</el-button>
          </div>
        </el-card>
      </el-col>
      <el-col :span="5" :offset="1">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span>挑战对赌设置</span>
          </div>
          <div class="">
            <span style="margin-right: 20px">挑战对赌</span>
            <el-switch
              v-model="challengeSwitch"
              active-color="#13ce66"
              inactive-color="#ccc"
              >
            </el-switch>
            <el-button style="margin-left: 100px;margin-top:10px" type="primary" size="small" @click="challengeSwitchHandle(challengeSwitch)">保存</el-button>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>

</template>

<script>
  import { platformSetupInfo , platformSetup} from "@/api/dingpc/flatformManage"
  export default {
    name: 'index',
    data() {
      return {
        loading: true,
        netSwitch: false,
        challengeSwitch: false,
        dataSwitch: false,
      }
    },
    methods: {
      getPlatformSetupInfo () {
        platformSetupInfo().then((respone)=>{
          if(respone.code == 1){
            this.netSwitch = respone.data.net_change === 1 ? true :false
            this.dataSwitch = respone.data.data_change === 1 ? true :false
            this.challengeSwitch = respone.data.challenge_change === 1 ? true :false
          }
        })
      },

      setplatformSetup(options){
        platformSetup(options).then((respone)=>{
          if(respone.code == 1){
            this.$message({
              type:'success',
              message:'设置成功'
            })
          }else{
            this.$message.error('设置失败');
          }
        })
      },
      netSwitchHandle(msg){
        var netOptions = msg == true ? 1 : 0
        this.setplatformSetup({netChange:netOptions})
      },
      dataSwitchHandle(msg){
         var netOptions = msg == true ? 1 : 0
         this.setplatformSetup({dataChange:netOptions})
      },
      challengeSwitchHandle(msg){
         var netOptions = msg == true ? 1 : 0
        this.setplatformSetup({challengeChange:netOptions})
      }


    },
    created() {
      this.getPlatformSetupInfo()
    },
  }
</script>

<style scoped>

</style>
