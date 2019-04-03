<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">总网点数：{{allData.netSpotNum}}</el-col>
        <el-col :span="8" class="data-li li2">全网订单数：{{allData.orderNum}}</el-col>
        <el-col :span="8" class="data-li li3">总销售额数：{{allData.salesMoney}}</el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="8" class="search-li">
            <span>网点名称：</span>
            <el-input v-model="pageInfo.query" placeholder="请输入网点名称、编号或负责人" style="width: 60%"></el-input>
          </el-col>
          <el-col :span="8" class="search-li">
            <span>所属城市：</span>
            <el-cascader
              expand-trigger="click"
              ref="cascaderAddr"
              :options="cityData"
              v-model="selectedOptions"
              change-on-select
              clearable
              filterable
              @change="cityChange"
            ></el-cascader>
          </el-col>
          <!-- <el-col :span="8" class="search-li">
            <span>网点负责人：</span>
            <el-select v-model="netForm.person" placeholder="请选择">
              <el-option
                v-for="item in personList"
                :key="item.user_id"
                :label="item.nickname"
                :value="item.user_id"
              >
              </el-option>
            </el-select>
          </el-col>-->
        </el-row>
        <el-row class="tag-row">
          <el-col :span="18">
            <span>标签：</span>
            <el-tag
              v-for="(item, index) in tagList"
              :val="item.id"
              :key="index"
              class="tag-list"
              :type="item.checked?'':'info'"
              @click.native="toggleTag(index)"
            >{{item.tagName}}</el-tag>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click.native="search">搜索</el-button>
            <el-button class="addBtn" type="primary" @click="handleCreate">创建网点</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="people-list" v-loading="loading">
      <el-table :data="netSpotList" stripe style="width: 100%;" border fit highlight-current-row>
        <el-table-column prop="net_spot_num" label="网点编号" align="center"></el-table-column>
        <el-table-column prop="net_spot_name" label="网点名称" align="center"></el-table-column>
        <el-table-column label="标签" width="200" align="center">
          <template slot-scope="props">
            <el-tag
              type="success"
              v-for="item in props.row.net_spot_tag_name"
              :key="item"
              style="margin-left: 5px;"
            >{{item}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="城市" width="200" align="center">
          <template slot-scope="props">
            <span>{{props.row.province}}</span>-
            <span>{{props.row.city}}</span>-
            <span>{{props.row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="nickname" label="网点负责人" align="center"></el-table-column>
        <el-table-column prop="sales_person" label="人员数量" align="center"></el-table-column>
        <el-table-column prop="order_count" label="网点总订单数" align="center"></el-table-column>
        <el-table-column prop="order_sum" label="网点总销售额" align="center"></el-table-column>
        <el-table-column label="状态" width="120" align="center">
          <template slot-scope="props">
            <el-switch
              v-model="props.row.status.code"
              :inactive-value="0"
              :active-value="1"
              @change="switchChange(props.$index, props.row)"
            ></el-switch>
            <span v-if="props.row.status.code == 1">{{props.row.status.desc}}</span>
            <span v-else style="color: lightgray">{{props.row.status.desc}}</span>
          </template>
        </el-table-column>
        <el-table-column width="300px" label="操作" align="center">
          <template slot-scope="scope">
            <router-link :to="{name:'netDetail', query:{netSpot_id:scope.row.id}}">
              <el-button size="mini" type="success">详情</el-button>
            </router-link>
            <router-link :to="{name:'setSalesPerson', query:{netSpot_id:scope.row.id}}">
              <el-button type="primary" size="mini">设置展业员</el-button>
            </router-link>
            <el-button size="mini" type="danger" @click="netDel(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageInfo.page"
        :limit.sync="pageInfo.limit"
        @pagination="getNetData"
      />
    </div>
    <div class="components-container">
      <el-dialog
        v-el-drag-dialog
        :visible.sync="dialogTableVisible"
        title="创建网点"
        @dragDialog="handleDrag"
      >
        <el-form ref="form" :model="netForm" label-width="100px">
          <el-form-item label="网点编号">
            <el-input v-model="netForm.num" placeholder="请输入网点编号"></el-input>
          </el-form-item>
          <el-form-item label="网点名称">
            <el-input v-model="netForm.name" placeholder="请输入网点名称"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="netForm.selectTag" multiple placeholder="请选择" style="width: 50%">
              <el-option
                v-for="item in tagList"
                :key="item.val"
                :label="item.tagName"
                :value="item.val"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在城市">
            <el-cascader
              expand-trigger="hover"
              ref="netAddr"
              :options="cityData"
              v-model="netCityOption"
              clearable
              filterable
              @change="netCityChange"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="网点负责人">
            <el-select v-model="netForm.person" placeholder="请选择">
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
          <el-form-item>
            <el-button @click="dialogTableVisible = false">取消</el-button>
            <el-button type="primary" @click="onSubmit">保存</el-button>
          </el-form-item>
        </el-form>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import * as city from '@/utils/city-data'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Pagination from '@/components/Pagination'
import { getNetData, delNet, netStatus, addNetSpot } from '@/api/dingpc/NetSpot'
import { addSalesPerson } from '@/api/dingpc/SalesPerson'
import { productTag } from '@/api/dingpc/ProductManage'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  name: 'index',
  data() {
    return {
      loading: true,
      allData: {
        netSpotNum: 0,
        orderNum: 0,
        salesMoney: 0
      },
      netSpotList: [],
      pageInfo: {
        page: 1,
        limit: 10,
        province: undefined,
        city: undefined,
        area: undefined,
        tag: undefined,
        query: undefined
      },
      total: 0,
      cityData: city.cityInfo,
      selectedOptions: [],
      netCityOption: [],
      searchInput: '',
      netData: [],
      professionData: [],
      netPersonName: '',
      tagList: [],
      sProvince: '',
      sCity: '',
      sArea: '',
      sTag: '',
      dialogTableVisible: false,
      netForm: {
        num: '',
        name: '',
        person: '',
        netProvince: '',
        netCity: '',
        netArea: '',
        selectTag: []
      },
      personList: [],
      groupTag: []
    }
  },
  methods: {
    getNetData() {
      this.loading = true
      if (this.pageInfo.tag === '') {
        this.pageInfo.tag = undefined
      }
      getNetData(this.pageInfo).then(response => {
        if (response.data) {
          this.allData.netSpotNum = response.data.net_spot_count
          this.allData.orderNum = response.data.all_order_count
          this.allData.salesMoney = response.data.all_order_sum
          var list = response.data.items
          list.forEach(item => {
            item.net_spot_tag_name = item.net_spot_tag_name.split(',')
          })
          this.netSpotList = list
          this.total = response.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    getTag() {
      productTag({
        viewId: 1
      }).then(response => {
        if (response.data) {
          for (let i = 0, len = response.data.length; i < len; i++) {
            this.tagList.push({
              tagName: response.data[i].name,
              val: response.data[i].id,
              checked: false
            })
          }
        }
      })
    },
    getAllPerson() {
      addSalesPerson({ requestType: 0 }).then(response => {
        if (response.data) {
          this.personList = response.data
        }
      })
    },
    switchChange(index, row) {
      netStatus({
        net_spot_id: row.id,
        status: row.status.code
      }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: response.msg,
            duration: '1500'
          })
        }
      }).finally(() => {
        this.loading = false
      })
    },
    handleEdit(index, row) {
      this.dialogTableVisible = true
      console.log(index, row)
    },
    cityChange(value) {
      this.pageInfo.province = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
      this.pageInfo.city = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
      this.pageInfo.area = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
    },
    netCityChange(value) {
      this.netForm.netProvince = this.$refs['netAddr'].currentLabels[0] === undefined ? '' : this.$refs['netAddr'].currentLabels[0]
      this.netForm.netCity = this.$refs['netAddr'].currentLabels[1] === undefined ? '' : this.$refs['netAddr'].currentLabels[1]
      this.netForm.netArea = this.$refs['netAddr'].currentLabels[2] === undefined ? '' : this.$refs['netAddr'].currentLabels[2]
    },
    toggleTag(index) {
      this.tagList[index].checked = !this.tagList[index].checked
      this.pageInfo.tag = ''
      for (let i = 0, len = this.tagList.length; i < len; i++) {
        if (this.tagList[i].checked) {
          this.pageInfo.tag += this.tagList[i].val + ','
        }
      }
      this.pageInfo.tag = this.pageInfo.tag.substr(0, this.pageInfo.tag.length - 1)
      // var tag = []
      // this.tagList.forEach(item => {
      //   if (item.checked) {
      //     tag.push(item.val)
      //   }
      // })
      // this.pageInfo.tag = tag
    },
    search() {
      this.pageInfo.page = 1
      this.getNetData()
    },
    netDel(index, row) {
      this.$confirm('是否删除 ' + row.net_spot_name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delNet({
          netId: row.id
        }).then(response => {
          if (response.data) {
            this.netSpotList.splice(index, 1)
            this.$message({
              type: 'success',
              message: '删除成功!',
              duration: '1500'
            })
          }
        })
      })
    },
    handleDrag() { },
    handleCreate() {
      this.getAllPerson()
      this.dialogTableVisible = true
      this.netForm = {
        num: '',
        name: '',
        person: '',
        netProvince: '',
        netCity: '',
        netArea: '',
        selectTag: []
      }
    },
    onSubmit() {
      var params = {
        net_spot_num: this.netForm.num,
        net_spot_name: this.netForm.name,
        user_id: this.netForm.person,
        province: this.netForm.netProvince,
        city: this.netForm.netCity,
        area: this.netForm.netArea,
        tag: this.netForm.selectTag
      }
      addNetSpot(params).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '保存成功!',
            duration: '1500'
          })
          this.getNetData()
          this.dialogTableVisible = false
        }
      })
    }
  },
  created() {
    this.getNetData()
    this.getTag()
  }
}
</script>
