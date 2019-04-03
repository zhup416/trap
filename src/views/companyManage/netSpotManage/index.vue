<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">总网点数：{{allData.netSpotNum}}</el-col>
        <el-col :span="8" class="data-li li2">全网订单数：{{allData.orderNum}}</el-col>
        <el-col :span="8" class="data-li li3">总销售额数：{{allData.salesMoney}}</el-col>
      </el-row>
    </div>

    <div class="searchBox">
      <el-button class="addBtn" type="primary" @click="dialogTableVisible = true">创建网点</el-button>
      <el-row>
        <el-col :span="8" class="search-li">
          <span>网点名称：</span>
          <el-input v-model="searchInput" placeholder="请输入网点名称或编号" style="width: 60%"></el-input>
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
            @change="cityChange">
          </el-cascader>
        </el-col>
        <el-col :span="8" class="search-li">
          <span>网点负责人：</span>
          <el-input v-model="netPersonName" placeholder="请输入网点负责人姓名" style="width: 60%"></el-input>
        </el-col>
      </el-row>
      <el-row class="tag-row">
        <el-col :span="18">
          <span>标签：</span>
          <el-tag v-for="(item, index) in tagList" :val="item.id" :key="index" class="tag-list" :type="item.checked?'':'info'" @click.native="toggleTag(index)">{{item.tagName}}</el-tag>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click.native="search">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="people-list" v-loading="loading">
      <el-table
        :data="netSpotList"
        stripe
        style="width: 100%;">
        <el-table-column
          prop="net_spot_num"
          label="网点编号">
        </el-table-column>
        <el-table-column
          prop="net_spot_name"
          label="网点名称">
        </el-table-column>
        <el-table-column
          label="标签"
          width="200">
          <template slot-scope="props">
            <span v-for="item in props.row.tag">{{item.name+'&nbsp; '}}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="城市"
          width="200">
          <template slot-scope="props">
            <span>{{props.row.province}}</span>-
            <span>{{props.row.city}}</span>-
            <span>{{props.row.area}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          label="网点负责人">
        </el-table-column>
        <el-table-column
          prop="peopleCount"
          label="人员数量">
        </el-table-column>
        <el-table-column
          prop="orderCount"
          label="网点总订单数">
        </el-table-column>
        <el-table-column
          prop="priceCount.price"
          label="网点总销售额">
        </el-table-column>
        <el-table-column
          label="状态"
          width="120">
          <template slot-scope="props">
            <el-switch
              v-model="props.row.status"
              :inactive-value=1
              :active-value=0
              @change="switchChange(props.$index, props.row)"
              >
            </el-switch>
            <span v-if="props.row.status == 0">开业</span>
            <span v-else style="color: lightgray">停业</span>
          </template>
        </el-table-column>
        <el-table-column
          width="300px"
          label="操作">
          <template slot-scope="scope">
            <router-link :to="{name:'netDetail', query:{netSpot_id:scope.row.id}}">
              <el-button
                size="mini"
                type="success"
                >详情</el-button>
            </router-link>
            <router-link :to="{name:'setSalesPerson', query:{netSpot_id:scope.row.id}}">
            <el-button
              type="primary"
              size="mini"
              >设置展业员</el-button>
            </router-link>
            <el-button
              size="mini"
              type="danger"
              @click="netDel(scope.$index, scope.row)"
              >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-col class="pageBox" :span="6">
          <el-pagination
            background
            @current-change="handleCurrentChange"
            :current-page="pageInfo.page"
            :page-size="pageInfo.limit"
            layout="prev, pager, next"
            :total="pageInfo.total">
          </el-pagination>
        </el-col>
      </el-row>
    </div>
      <div class="components-container">
        <el-dialog v-el-drag-dialog :visible.sync="dialogTableVisible" :before-close="closeDialog" title="创建网点" @dragDialog="handleDrag">
          <el-form ref="form" :model="netForm" label-width="100px">
            <el-form-item label="网点编号">
              <el-input v-model="netForm.num"></el-input>
            </el-form-item>
            <el-form-item label="网点名称">
              <el-input v-model="netForm.name"></el-input>
            </el-form-item>
            <el-form-item label="标签">
              <el-select multiple v-model="netForm.selectTag" placeholder="请选择" style="width: 100%">
                <el-option-group
                  v-for="group in groupTag"
                  :key="group.name"
                  :label="group.name">
                  <el-option
                    v-for="item in group.tag"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-option-group>
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
                @change="netCityChange">
              </el-cascader>
            </el-form-item>
            <el-form-item label="网点负责人">
              <el-select v-model="netForm.person" placeholder="请选择">
                <el-option
                  v-for="item in personList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                  <span style="float: left">{{ item.name }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ item.num }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmit">保存</el-button>
              <el-button @click="closeDialog">取消</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>
      </div>
    </div>

</template>

<script>
  import * as city from '../../../utils/city-data'
  import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
  import { getNetData, getTagList, delNet, netStatus, getNetTag, getAllPerson, addNetSpot } from '@/api/dingpc/NetSpot'
  export default {
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
          limit: 5,
          total: 10
        },
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
        getNetData({
          id: 1, // 公司id
          page: 1,
          limit: this.pageInfo.limit
        }).then(response => {
          if (response.data) {
            this.allData.netSpotNum = response.data.allnetCount
            this.allData.orderNum = response.data.allnetOrder
            this.allData.salesMoney = response.data.allnetPrice
            this.netSpotList = response.data.show
            this.pageInfo.total = response.data.count
          }
        }).finally(() => {
          this.loading = false
        })
      },
      getTag() {
        getTagList({
          id: 1
        }).then(response => {
          if (response.data) {
            for (let i = 0, len = response.data.length; i < len; i++) {
              this.tagList.push({
                tagName: response.data[i].name,
                val: response.data[i].id,
                checked: false
              })
            }
            console.log(this.tagList)
          }
        }).finally(() => {

        })
      },
      geNetTag() {
        getNetTag({
          id: 1
        }).then(response => {
          if (response.data) {
            this.groupTag = response.data
          }
        }).finally(() => {

        })
      },
      getAllPerson() {
        getAllPerson({
          id: 1
        }).then(response => {
          if (response.data) {
            this.personList = response.data
          }
        }).finally(() => {

        })
      },
      switchChange(index, row) {
        netStatus({
          'netId': row.id
        }).then(response => {
          if (response.code === 1) {
            console.log('更改成功')
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
        this.sProvince = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
        this.sCity = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
        this.sArea = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
      },
      netCityChange(value) {
        this.netForm.netProvince = this.$refs['netAddr'].currentLabels[0] === undefined ? '' : this.$refs['netAddr'].currentLabels[0]
        this.netForm.netCity = this.$refs['netAddr'].currentLabels[1] === undefined ? '' : this.$refs['netAddr'].currentLabels[1]
        this.netForm.netArea = this.$refs['netAddr'].currentLabels[2] === undefined ? '' : this.$refs['netAddr'].currentLabels[2]
      },
      toggleTag(index) {
        this.tagList[index].checked = !this.tagList[index].checked
        this.sTag = ''
        for (let i = 0, len = this.tagList.length; i < len; i++) {
          if (this.tagList[i].checked) {
            this.sTag += this.tagList[i].val + ','
          }
        }
        this.sTag = this.sTag.substr(0, this.sTag.length - 1)
      },
      handleCurrentChange(val) {
        this.loading = true
        this.pageInfo.page = val
        getNetData({
          'page': this.pageInfo.page,
          'limit': this.pageInfo.limit,
          'netName': this.searchInput,
          'province': this.sProvince,
          'city': this.sCity,
          'area': this.sArea,
          'manager': this.netPersonName,
          'tag': this.sTag,
          'id': 1
        }).then(response => {
          if (response.data) {
            this.allData.netSpotNum = response.data.allnetCount
            this.allData.orderNum = response.data.allnetOrder
            this.allData.salesMoney = response.data.allnetPrice
            this.netSpotList = response.data.show
          }
        }).finally(() => {
          this.loading = false
        })
      },
      search() {
        this.loading = true
        this.pageInfo.page = 1
        getNetData({
          'page': this.pageInfo.page,
          'limit': this.pageInfo.limit,
          'netName': this.searchInput,
          'province': this.sProvince,
          'city': this.sCity,
          'area': this.sArea,
          'manager': this.netPersonName,
          'tag': this.sTag,
          'id': 1
        }).then(response => {
          if (response.data) {
            this.allData.netSpotNum = response.data.allnetCount
            this.allData.orderNum = response.data.allnetOrder
            this.allData.salesMoney = response.data.allnetPrice
            this.netSpotList = response.data.show
          }
        }).finally(() => {
          this.loading = false
        })
      },
      netDel(index, row) {
        console.log(row)
        this.$confirm('是否删除 ' + row.net_spot_name + ' ?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          delNet({
            netId: row.id
          }).then(response => {
            if (response.code === 1) {
              for (let i = 0, len = this.netSpotList.length; i < len; i++) {
                if (this.netSpotList[i].id === row.id) {
                  this.netSpotList.splice(i, 1)
                }
              }
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
            }
          }).finally(() => {
          })
        }).catch(() => {
        })
      },
      handleDrag() {
        // this.$refs.select.blur()
      },
      closeDialog() {
        this.dialogTableVisible = false
        this.netForm.num = ''
        this.netForm.name = ''
        this.netForm.person = ''
        this.netForm.netProvince = ''
        this.netForm.netCity = ''
        this.netForm.netArea = ''
        this.netCityOption = []
        this.netForm.selectTag = []
      },
      onSubmit() {
        addNetSpot({
          id: 1,
          netNum: this.netForm.num,
          netName: this.netForm.name,
          tag: this.netForm.selectTag.toString(),
          province: this.netForm.netProvince,
          city: this.netForm.netCity,
          area: this.netForm.netArea,
          personid: this.netForm.person
        }).then(response => {
          if (response.code === 1) {
            this.$message({
              type: 'success',
              message: '保存成功!'
            })
            this.dialogTableVisible = false
          }
        }).finally(() => {
        })
      }
    },
    created() {
      this.getNetData()
      this.getTag()
      this.geNetTag()
      this.getAllPerson()
    }
  }
</script>

<style scoped>
  .all-data{
    margin: 0 auto;

  }
  .all-data .data-li{
    text-align: center;
    line-height: 3em;
    color: black;
  }
  .li1{
    background: #F0F0EE;
  }
  .li2{
    background: #fafafa;
  }
  .li3{
    background: #F0F0EE;
  }
  .searchBox{
    padding: 10px;
    border: 1px solid #e1e1e1;
    box-shadow: 0 0 3px #ededee;
    margin: 20px 10px;
  }
  .tag-row{
    margin: 30px 0 20px 0;
  }
  .tag-list{
    cursor: pointer;
    margin: 0 5px;
  }
  .pageBox{
    margin: 30px;
  }
  .addBtn{
    margin: 10px 0 20px 0;
  }
</style>
