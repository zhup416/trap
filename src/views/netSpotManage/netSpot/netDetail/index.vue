<template>
  <div class="app-container" v-loading="loading">
    <div v-if="!showEdit">
      <el-form ref="netData" :model="netData" label-width="150px">
        <el-form-item label="网点编号：">
          <span>{{netData.net_spot_num}}</span>
        </el-form-item>
        <el-form-item label="网点名称：">
          <span>{{netData.net_spot_name}}</span>
        </el-form-item>
        <el-form-item label="选择标签：">
          <el-tag
            type="success"
            v-for="item in netData.tag"
            :key="item.id"
            style="margin-right: 5px;"
          >{{item.name}}</el-tag>
        </el-form-item>
        <el-form-item label="所在城市：">
          <span>{{netData.province}}</span>-
          <span>{{netData.city}}</span>-
          <span>{{netData.area}}</span>
        </el-form-item>
        <el-form-item label="网点负责人：">
          <span>{{netData.nickname}}</span>
          <span style="margin-left: 30px;">手机号：</span>
          <span>{{netData.phone}}</span>
        </el-form-item>
        <el-form-item label="人员数量：">
          <span>{{netData.peopleCount}}</span>
          <el-button type="success" size="mini" style="margin-left: 20px;" @click="handleExamine">查看</el-button>
        </el-form-item>
      </el-form>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>业绩统计</span>
        </div>
        <h2>当前网点排名：No:1</h2>
        <el-table :data="netDataArr" border style="width: 100%">
          <el-table-column prop="orderCount" label="网点总订单数" align="center"></el-table-column>
          <el-table-column prop="priceCount" label="网点总销售额" align="center"></el-table-column>
          <el-table-column prop="orderYear" label="本年度网点订单数" align="center"></el-table-column>
          <el-table-column prop="priceYear" label="本年度网点销售额" align="center"></el-table-column>
          <el-table-column prop="orderLastYear" label="上一年度网点订单数" align="center"></el-table-column>
          <el-table-column prop="priceLastYear" label="上一年度网点销售额" align="center"></el-table-column>
        </el-table>
      </el-card>
      <br>
      <div style="text-align: center">
        <el-button round style="margin: 30px;width: 100px" @click="handleToIndex">返回</el-button>
        <el-button
          type="primary"
          round
          style="margin: 30px;width: 100px"
          @click="showEdit = true"
        >编辑</el-button>
      </div>
    </div>

    <div v-if="showEdit">
      <el-card class="box-card" style="margin-bottom: 30px">
        <div slot="header" class="clearfix">
          <span>基本信息</span>
        </div>
        <el-form ref="netData" :model="netData" label-width="150px">
          <el-form-item label="网点编号：">
            <el-col :span="6">
              <el-input type="number" v-model="netData.net_spot_num"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="网点名称：">
            <el-col :span="6">
              <el-input v-model="netData.net_spot_name"></el-input>
            </el-col>
          </el-form-item>
          <el-form-item label="选择标签：">
            <el-select
              v-model="selectTag"
              multiple
              placeholder="请选择"
              style="width: 400px;"
              clearable
            >
              <el-option v-for="item in tagList" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市：">
            <el-col :span="6">
              <el-cascader
                expand-trigger="click"
                ref="cascaderAddr"
                :options="cityData"
                v-model="selectedOptions"
                change-on-select
                clearable
                filterable
                @change="cityChange"
                style="width: 70%;"
              ></el-cascader>
            </el-col>
          </el-form-item>
          <el-form-item label="网点负责人：">
            <el-select v-model="netData.user_id" placeholder="请选择" @change="isNetSpotAdmin">
              <el-option
                v-for="item in personList"
                :key="item.user_id"
                :label="item.nickname"
                :value="item.user_id"
              >
                <span style="float: left">{{ item.nickname }}</span>
                <span
                  style="float: right; color: #8492a6; font-size: 13px"
                  v-if="item.is_net_spot_admin === 1"
                >网点管理员</span>
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </el-card>
      <div style="text-align: center">
        <el-button round style="margin: 30px;width: 100px" @click="handleToIndex">取消</el-button>
        <el-button type="primary" round style="margin: 30px;width: 100px" @click="updateData">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import * as city from '@/utils/city-data'
import { netDetail, addNetSpot } from '@/api/dingpc/NetSpot'
import { addSalesPerson } from '@/api/dingpc/SalesPerson'
import { productTag } from '@/api/dingpc/ProductManage'
export default {
  name: 'index',
  created() {
    this.netSpotId = this.$route.query.netSpot_id
    if (this.netSpotId) {
      this.getNetData()
    } else {
      this.$message.error('错了哦，请从列表选择网点详情')
      this.$router.push({ name: 'netSpotIndex' })
    }
    this.getTagList()
    this.getAllPerson()
  },
  data() {
    return {
      loading: true,
      showEdit: false,
      cityData: city.cityInfo,
      selectedOptions: [],
      selectTag: [],
      personList: [],
      sProvince: '',
      sCity: '',
      sArea: '',
      netSpotId: '',
      netData: {
        net_spot_num: undefined
      },
      netDataArr: []
    }
  },
  methods: {
    getNetData() {
      this.loading = true
      netDetail({ net_spot_id: this.netSpotId }).then(res => {
        this.loading = false
        var data = res.data
        this.netData = data
        this.netDataArr.push(data)
        data.tag.forEach(item => {
          this.selectTag.push(item.id)
        })
        var provinceStr = 0
        var cityStr = 0
        var areaStr = 0
        city.cityInfo.forEach(item => {
          if (data.province === item.label) {
            provinceStr = item.value
            item.children.forEach(val => {
              if (data.city === val.label) {
                cityStr = val.value
                val.children.forEach(ele => {
                  if (data.area === ele.label) {
                    areaStr = ele.value
                  }
                })
              }
            })
          }
        })
        this.sProvince = data.province
        this.sCity = data.city
        this.sArea = data.area
        this.selectedOptions.push(provinceStr)
        this.selectedOptions.push(cityStr)
        this.selectedOptions.push(areaStr)
      })
    },
    isNetSpotAdmin() {
      console.log(this.netData.user_id)
      var user = this.netData.user_id
      this.personList.forEach(item => {
        if (user === item.user_id) {
          if (item.is_net_spot_admin === 1) {
            if (item.nickname !== this.netData.nickname) {
              this.$message({
                message: '该人员已是其他网点负责人!',
                type: 'warning',
                duration: '1500'
              })
            }
          }
        }
      })
    },
    handleToIndex() {
      this.$router.push({ name: 'netSpotIndex' })
    },
    handleExamine() {
      this.$router.push({ path: 'setSalesPerson', query: { netSpot_id: this.netSpotId }})
    },
    getAllPerson() {
      addSalesPerson({ requestType: 0 }).then(response => {
        if (response.data) {
          this.personList = response.data
        }
      })
    },
    cityChange(value) {
      this.sProvince = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
      this.sCity = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
      this.sArea = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
    },
    updateData() {
      var params = {
        net_spot_id: this.netSpotId,
        net_spot_num: this.netData.net_spot_num,
        net_spot_name: this.netData.net_spot_name,
        user_id: this.netData.user_id,
        province: this.sProvince,
        city: this.sCity,
        area: this.sArea,
        tag: this.selectTag
      }
      console.log(params)
      addNetSpot(params).then(res => {
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
        this.$router.push({ name: 'netSpotIndex' })
      })
    },
    getTagList() {
      productTag({ viewId: 1 }).then(res => {
        this.tagList = res.data
      })
    }
  }
}
</script>

<style scoped>
</style>
