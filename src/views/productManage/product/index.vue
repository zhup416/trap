<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">产品总数：{{allData.productNum}}</el-col>
        <el-col :span="8" class="data-li li2">产品浏览总数：{{allData.productSeeNum}}</el-col>
        <el-col :span="8" class="data-li li3">产品销售总量：{{allData.productSaleNum}}</el-col>
      </el-row>
    </div>

    <div class="filter-container">
      <el-card class="box-card" shadow="hover" style="margin: 15px 0 5px;">
        <el-row>
          <el-col :span="8" class="search-li">
            <span>产品信息：</span>
            <el-input v-model="searchInput" placeholder="请输入产品名称或编号" style="width: 60%"></el-input>
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
          <el-col :span="8" class="search-li">
            <span>销售区域：</span>
            <el-select v-model="netSpotId" clearable placeholder="请选择">
              <el-option
                v-for="item in netData"
                :key="item.id"
                :label="item.net_spot_name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
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
            <el-button class="addBtn" type="primary" @click="handleCreate">创建产品</el-button>
          </el-col>
        </el-row>
      </el-card>
    </div>
    <div class="people-list">
      <el-table
        v-loading="loading"
        :data="productList"
        border
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column label="序号" prop="id" align="center" width="65">
          <template slot-scope="scope">
            <span>{{ scope.row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品名称" width="180px" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产品分类" min-width="150px" align="center">
          <template slot-scope="scope">
            <span>{{scope.row.one_classify_id.classify_name}}-{{scope.row.two_classify_id.classify_name}}-{{scope.row.three_classify_id.classify_name}}</span>
          </template>
        </el-table-column>

        <el-table-column label="价格" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="库存" align="center" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.stock }}</span>
          </template>
        </el-table-column>
        <el-table-column label="实际销量" width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.saleNum }}</span>
          </template>
        </el-table-column>

        <el-table-column label="标签" min-width="180px" align="center">
          <template slot-scope="scope">
            <el-tag
              type="success"
              v-for="item in scope.row.tag"
              :key="item.id"
              style="margin-right: 5px;"
            >{{item.name}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="110" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.status.code == 1">上架中</span>
            <span v-else>已下架</span>
          </template>
        </el-table-column>
        <el-table-column label="是否推荐" width="120" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.recommend.code"
              :inactive-value="0"
              :active-value="1"
              @change="productRecommend(scope.$index, scope.row)"
            ></el-switch>
            <span v-if="scope.row.recommend.code == 1">推荐</span>
            <span v-else style="color: lightgray">不推荐</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          min-width="150"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status.code == 1"
              size="mini"
              type="info"
              @click="upProduct(scope.$index, scope.row)"
            >下架</el-button>
            <el-button
              v-else
              size="mini"
              type="primary"
              @click="upProduct(scope.$index, scope.row)"
            >上架</el-button>
            <el-button v-if="scope.row.status.code == 0" size="mini" type="success">编辑</el-button>
            <el-button
              v-if="scope.row.status.code == 0"
              size="mini"
              type="danger"
              @click="productDel(scope.$index, scope.row)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="pageInfo.curPage"
        :limit.sync="pageInfo.pageSize"
        @pagination="getProductData"
      />
    </div>
  </div>
</template>

<script>
import * as city from '../../../utils/city-data'
import elDragDialog from '@/directive/el-dragDialog' // base on element-ui
import Pagination from '@/components/Pagination'
import { getProductList, getSubTag, productRecommend, productUpDown, delProduct } from '@/api/dingpc/ProductManage'
import { getNetSpot } from '@/api/dingpc/SalesPerson'
export default {
  components: { Pagination },
  directives: { elDragDialog },
  name: 'index',
  data() {
    return {
      loading: true,
      allData: {
        productNum: 0,
        productSeeNum: 0,
        productSaleNum: 0
      },
      productList: [],
      pageInfo: {
        curPage: 1,
        pageSize: 10
      },
      total: 0,
      cityData: city.cityInfo,
      selectedOptions: [],
      netData: [],
      netSpotId: undefined,
      searchInput: '',
      tagList: [],
      sProvince: '',
      sCity: '',
      sArea: '',
      sTag: ''
    }
  },
  methods: {
    getProductData() {
      this.loading = true
      getProductList({
        companyId: 1,
        page: this.pageInfo.curPage,
        limit: this.pageInfo.pageSize,
        tag: this.sTag,
        productName: this.searchInput,
        province: this.sProvince,
        net_spot: this.netSpotId,
        city: this.sCity,
        area: this.sArea
      }).then(response => {
        if (response.code === 1) {
          this.allData.productNum = response.data.productCount
          this.allData.productSeeNum = response.data.seeCount
          this.allData.productSaleNum = response.data.salesCount
          this.productList = response.data.list
          this.total = response.data.total
        }
      }).finally(() => {
        this.loading = false
      })
    },
    switchChange(index, row) {
    },
    indexMethod(index) {
      return (this.pageInfo.curPage - 1) * this.pageInfo.pageSize + (index + 1)
    },
    getSubTag() {
      getSubTag({ companyId: 1, viewId: 3 }).then(response => {
        if (response.code === 1) {
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
    cityChange(value) {
      this.sProvince = this.$refs['cascaderAddr'].currentLabels[0] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[0]
      this.sCity = this.$refs['cascaderAddr'].currentLabels[1] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[1]
      this.sArea = this.$refs['cascaderAddr'].currentLabels[2] === undefined ? '' : this.$refs['cascaderAddr'].currentLabels[2]
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
      this.pageInfo.curPage = val
      this.getProductData()
    },
    search() {
      this.loading = true
      this.pageInfo.curPage = 1
      this.getProductData()
    },
    productRecommend(index, row) {
      productRecommend({ productId: row.id, recommend: row.recommend.code }).then(response => {
        if (response.code === 1) {
          this.$message({
            type: 'success',
            message: '修改成功!'
          })
        }
      }).finally(() => {

      })
    },
    getNetSpot() {
      getNetSpot().then(response => {
        if (response.code === 1) {
          this.netData = response.data
        }
      })
    },
    upProduct(index, row) {
      let str = ''
      if (row.status.code === 1) {
        str = '下架'
      } else {
        str = '上架'
      }
      this.$confirm('是否' + str + '商品' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        productUpDown({ productId: row.id, status: row.status.code }).then(response => {
          if (response.code === 1) {
            row.status.code = row.status.code === 1 ? 0 : 1
            this.$message({
              type: 'success',
              message: '修改成功!'
            })
          }
        }).finally(() => {

        })
      }).catch(() => { })
    },
    handleCreate() {
      this.$router.push({ name: 'addProduct' })
    },
    productDel(index, row) {
      this.$confirm('是否删除 ' + row.name + ' ?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        delProduct({ product_id: row.id }).then(response => {
          if (response.code === 1) {
            for (let i = 0, len = this.productList.length; i < len; i++) {
              if (this.productList[i].id === row.id) {
                this.productList.splice(i, 1)
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
    }
  },
  created() {
    this.getProductData()
    this.getSubTag()
    this.getNetSpot()
  }
}
</script>

<style scoped>
.all-data {
  margin: 0 auto;
}
.all-data .data-li {
  text-align: center;
  line-height: 3em;
  color: black;
}
.li1 {
  background: #f0f0ee;
}
.li2 {
  background: #fafafa;
}
.li3 {
  background: #f0f0ee;
}
.tag-row {
  margin-top: 30px;
}
.tag-list {
  cursor: pointer;
  margin: 0 5px;
}
.addBtn {
  margin-left: 10px;
}
</style>
