<template>
  <div class="components-container">
    <el-form
      ref="form"
      :model="add"
      label-width="160px"
      v-loading="listLoading"
      element-loading-text="给我一点时间"
      v-if="!showNext"
    >
      <el-row :gutter="20" class="oneBill">
        <el-form-item label="产品分类：">
          <el-col :span="10">
            <el-cascader
              :options="classify"
              v-model="add.selectedClassify"
              @change="handleChange"
              style="width: 250px;"
            ></el-cascader>
          </el-col>
        </el-form-item>

        <el-form-item label="产品名称：">
          <el-col :span="6">
            <el-input v-model="add.name" placeholder="请输入产品名称" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="产品简称：">
          <el-col :span="6">
            <el-input v-model="add.introduce" placeholder="请输入产品简称" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="产品标签：">
          <el-col :span="24">
            <el-select v-model="add.tag" multiple placeholder="请选择" style="width: 50%">
              <el-option
                v-for="item in productTag"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-col>
        </el-form-item>

        <el-form-item label="产品价格（元）：">
          <el-col :span="6">
            <el-input type="number" v-model="add.price" placeholder="请输入产品价格" clearable></el-input>
          </el-col>
        </el-form-item>

        <el-form-item label="库存：">
          <el-col :span="6">
            <el-input type="number" v-model="add.inventory" placeholder="请输入库存" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新增单按比例佣金：">
          <el-col :span="6">
            <el-input type="number" v-model="add.addProportion" placeholder="请输入新增单按比例佣金" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="新增单固定佣金：">
          <el-col :span="6">
            <el-input type="number" v-model="add.addFixed" placeholder="请输入新增单固定佣金" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="续费单按比例佣金：">
          <el-col :span="6">
            <el-input
              type="number"
              v-model="add.renewProportion"
              placeholder="请输入续费单按比例佣金"
              clearable
            ></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="续费单固定佣金：">
          <el-col :span="6">
            <el-input type="number" v-model="add.renewFixed" placeholder="请输入续费单固定佣金" clearable></el-input>
          </el-col>
        </el-form-item>
        <el-form-item label="服务时间：">
          <el-col :span="6">
            <el-checkbox v-model="add.need_server">需要填写</el-checkbox>
          </el-col>
        </el-form-item>
      </el-row>

      <el-row :gutter="20" class="row-item card-item">
        <el-card class="box-card" shadow="hover">
          <div slot="header" class="clearfix">
            <span>查看权限设置</span>
          </div>
          <el-form-item label="查看权限：">
            <el-col :span="24">
              <el-radio-group v-model="firstId">
                <el-radio
                  :label="item.id"
                  v-for="item in power"
                  :key="item.id"
                >{{item.product_power_name}}</el-radio>
              </el-radio-group>
            </el-col>
          </el-form-item>
          <el-form-item label="选择网点：" v-if="firstId === 2">
            <el-radio-group v-model="networkId">
              <el-radio
                v-for="item in network"
                :label="item.id"
                :key="item.id"
                style="margin-top: 10px;"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择展业员：" v-if="firstId === 3">
            <el-radio-group v-model="partId">
              <el-radio
                v-for="item in selectPart"
                :label="item.id"
                :key="item.id"
                style="margin-top: 10px;"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择标签组：" v-if="firstId === 4">
            <el-radio-group v-model="tagGroupId">
              <el-radio
                v-for="item in selectTagGroup"
                :label="item.id"
                :key="item.id"
                style="margin-top: 10px;"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择标签：" v-if="firstId === 5">
            <el-radio-group v-model="tagId">
              <el-radio
                v-for="item in selectTag"
                :label="item.id"
                :key="item.id"
                style="margin-top: 10px;"
              >{{item.name}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-card>
      </el-row>

      <el-row :gutter="20" class="row-item card-item">
        <el-card class="box-card" shadow="hover" style="width: 100%;">
          <div slot="header" class="clearfix">
            <span>产品规格</span>
          </div>
          <div
            class="card-item specification"
            v-for="(items, index) in specificationArr"
            :key="index"
          >
            <div class="card-item">
              <el-col :span="12" style="padding: 0;">
                <el-input v-model="items.specificationName" :disabled="true"></el-input>
              </el-col>
              <el-button-group>
                <el-col :span="12" style="padding-right: 0;">
                  <el-input
                    v-model="items.specificationItem"
                    @keyup.enter.native="getSpecificationItem(index)"
                    placeholder="请输入规格项"
                  ></el-input>
                </el-col>
                <el-button
                  type="primary"
                  icon="el-icon-circle-plus-outline"
                  @click="getSpecificationItem(index)"
                  size="medium"
                >添加规格项</el-button>
                <el-button
                  type="danger"
                  size="medium"
                  icon="el-icon-close"
                  @click="delSpecification(index)"
                ></el-button>
              </el-button-group>
            </div>
            <el-button-group
              v-for="(item, num) in items.specificationMsg"
              :key="item.spec_value_name"
              class="specification-item"
            >
              <el-button>{{item.spec_value_name}}</el-button>
              <el-button
                type="danger"
                icon="el-icon-close"
                @click="delSpecificationItem(index, num)"
              ></el-button>
            </el-button-group>
          </div>

          <div class="card-item" v-if="showAddSpecification">
            <el-col :span="12" style="padding-right: 0;">
              <el-input
                v-model="specificationName"
                placeholder="规格名称(比如：颜色)"
                @keyup.enter.native="handleAddSpecification"
              ></el-input>
            </el-col>
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-circle-plus-outline"
                @click="handleAddSpecification"
                size="medium"
              >添加规格项</el-button>
              <el-button
                type="danger"
                size="medium"
                icon="el-icon-close"
                @click="showAddSpecification = false"
              ></el-button>
            </el-button-group>
          </div>

          <el-col>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="showAddSpecification = true"
              size="small"
            >添加规格</el-button>
            <!-- <el-button
              type="primary"
              size="small"
              icon="el-icon-refresh"
              @click="refreshTable"
            >刷新规格项目表</el-button> -->
          </el-col>
          <!-- :span-method="objectSpanMethod" -->
          <el-table :data="specificationTable" :span-method="objectSpanMethod" style="width: 100%;">
            <template v-for="col in specificationArr">
              <el-table-column
                :prop="col.desc"
                :label="col.specificationName"
                :key="col.desc"
                align="center"
              ></el-table-column>
            </template>
            <el-table-column align="center">
              <template slot="header" slot-scope="scope">
                <span>库存</span>
                <el-input v-model="allInventory" :change="unifiedColumn('inventory',allInventory)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.inventory"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="price" label="售价">
              <template slot="header" slot-scope="scope">
                <span>售价</span>
                <el-input v-model="allPrice" :change="unifiedColumn('price',allPrice)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.price"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="addProportion" label="新增单按比例佣金">
              <template slot="header" slot-scope="scope">
                <span>新增单按比例佣金</span>
                <el-input v-model="allAddProportion" :change="unifiedColumn('addProportion',allAddProportion)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.addProportion"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="addFixed" label="新增单固定佣金">
              <template slot="header" slot-scope="scope">
                <span>新增单固定佣金</span>
                <el-input v-model="allAddFixed" :change="unifiedColumn('addFixed',allAddFixed)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.addFixed"></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="renewProportion" label="续费单按比例佣金">
              <template slot="header" slot-scope="scope">
                <span>续费单按比例佣金</span>
                <el-input v-model="allRenewProportion" :change="unifiedColumn('renewProportion',allRenewProportion)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input
                  type="number"
                  v-model="scope.row.renewProportion"
                  style="text-align: center;"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="renewFixed" label="续费单固定佣金">
              <template slot="header" slot-scope="scope">
                <span>续费单固定佣金</span>
                <el-input v-model="allRenewFixed" :change="unifiedColumn('renewFixed',allRenewFixed)" type="number">
                  <i
                    slot="suffix"
                    class="el-input__icon el-icon-sort"
                    style="width: 45px;"
                  ></i>
                </el-input>
              </template>
              <template slot-scope="scope">
                <el-input type="number" v-model="scope.row.renewFixed"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>

      <el-row :gutter="20" class="row-item card-item">
        <el-card class="box-card" shadow="hover" style="width: 60%;">
          <div slot="header" class="clearfix">
            <span>关联介绍</span>
          </div>
          <div class="card-item">
            <el-button type="primary" @click.prevent="addRow()" size="small">增加关联项</el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click.prevent="delData()"
              size="small"
            >删除关联项</el-button>
          </div>
          <el-table
            :data="relatedData"
            ref="relatedData"
            tooltip-effect="dark"
            border
            stripe
            style="width: 100%"
            @selection-change="selectRow"
          >
            <el-table-column type="selection" width="45" align="center"></el-table-column>
            <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
            <el-table-column label="关联项名称" align="center" width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.relatedName"></el-input>
              </template>
            </el-table-column>
            <el-table-column label="类别" align="center" width="120">
              <template slot-scope="scope">
                <el-select v-model="scope.row.relatedType" placeholder="请选择">
                  <el-option
                    v-for="item in relatedOption"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="关联链接">
              <template slot-scope="scope">
                <el-input v-model="scope.row.relatedLink"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-row>

      <div style="text-align: center;width: 60%;">
        <el-button @click="handleSkip" style="margin: 30px;">取消</el-button>
        <el-button type="primary" @click="showNext = true" style="margin: 30px;">下一步</el-button>
      </div>
    </el-form>

    <el-form ref="add" :model="add" class="form-container" v-if="showNext">
      <div class="createPost-main-container">
        <el-form-item label="产品列表图：">
          <el-col :span="6">
            <!-- <Upload
              :file-list="add.image_uri"
              :limit="1"
              @on-success="handleUploadSuccess"
              @before-upload="beforeImageUpload"
              @on-remove="handleRemoveImage"
            />-->
            <image-upload></image-upload>
          </el-col>
        </el-form-item>
        <el-form-item label="产品轮播图：">
          <el-col :span="6">
            <Upload
              :file-list="add.imageGroup"
              :limit="5"
              @on-success="handleUploadSuccess"
              @before-upload="beforeImageUpload"
              @on-remove="handleRemoveImage"
            />
          </el-col>
        </el-form-item>
        <el-form-item prop="content" style="margin-bottom: 30px;">
          <Tinymce ref="editor" :height="400" v-model="add.content"/>
        </el-form-item>
        <div style="text-align: center;width: 60%;">
          <el-button @click="showNext = false" style="margin: 30px;">上一步</el-button>
          <el-button type="primary" style="margin: 30px;">发布</el-button>
        </div>
      </div>
    </el-form>
  </div>
</template>

<script>
import { productCategory, productTag, allPowerData } from '@/api/dingpc/ProductManage'
import Upload from '@/components/Uploader/imageListUploader'
import ImageUpload from '@/components/Uploader/oss'
import Tinymce from '@/components/Tinymce'
import _ from 'lodash'

export default {
  name: 'edit-article',
  data() {
    return {
      count: 1,
      relatedOption: [{
        value: '选项1',
        label: '文章'
      }, {
        value: '选项2',
        label: '问答'
      }],
      specificationName: '',
      specificationItem: '',
      listLoading: false,
      specificationArr: [],
      allSpecification: [],
      column_row_offset: {},
      now_col_row_num: {},
      now_col_offset: {},
      showAddSpecification: false,
      showNext: false,
      allRenewFixed: 0,
      allInventory: 0,
      allPrice: 0,
      allAddProportion: 0,
      allAddFixed: 0,
      allRenewProportion: 0,
      classify: [],
      productTag: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
      specificationTable: [],
      relatedData: [],
      selectlistRow: [],
      selectedClassify: [],
      power: [],
      network: [],
      selectPart: [],
      selectTagGroup: [],
      selectTag: [],
      firstId: undefined,
      partId: undefined,
      tagGroupId: undefined,
      tagId: undefined,
      networkId: undefined,
      add: {
        name: undefined,
        introduce: undefined,
        price: undefined,
        addsizecommission: undefined,
        addfixedcommission: undefined,
        consizecommission: undefined,
        confixedcommission: undefined,
        content: undefined,
        stock: undefined,
        company_id: undefined,
        product_img: undefined,
        one_classify_id: undefined,
        two_classify_id: undefined,
        three_classify_id: undefined,
        need_server: undefined,
        power_id: undefined,
        banner_img: undefined,
        tag: undefined,
        size: undefined,
        size_describe: undefined,
        limit: undefined,
        link: undefined
      }
    }
  },
  components: { Upload, Tinymce, ImageUpload },
  created() {
    this.getProductCategory()
    // this.getAllProductTag()
    this.getAllPowerData()
  },
  methods: {
    unifiedColumn(el, row) {
      _.forEach(this.specificationTable, (item, index) => {
        item[el] = row
      })
    },
    // 获取表格选中时的数据
    selectRow(val) {
      this.selectlistRow = val
    },
    // 增加行
    addRow() {
      var list = {
        rowNum: '',
        relatedName: this.relatedName,
        relatedType: this.relatedType,
        relatedLink: this.relatedLink
      }
      this.relatedData.unshift(list)
    },
    // 删除选中行
    delData() {
      for (let i = 0; i < this.selectlistRow.length; i++) {
        const val = this.selectlistRow
        // 获取选中行的索引的方法
        // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
        // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
        val.forEach((val, index) => {
          this.relatedData.forEach((v, i) => {
            if (val.rowNum === v.rowNum) {
              // i 为选中的索引
              this.relatedData.splice(i, 1)
            }
          })
        })
      }
      // 删除完数据之后清除勾选框
      this.$refs.relatedData.clearSelection()
    },
    delSpecification(index) {
      this.specificationArr.splice(index, 1)
    },
    delSpecificationItem(index, num) {
      this.specificationArr[index].specificationMsg.splice(num, 1)
      this.refreshTable()
    },
    getSpecificationItem(index) {
      if (this.specificationArr[index].specificationItem === '') {
        this.$message('请填写规格项！')
      } else {
        if (JSON.stringify(this.specificationArr[index].specificationMsg).indexOf(JSON.stringify(this.specificationArr[index].specificationItem)) === 1) {
          this.$message('规格项已存在！')
        } else {
          var obj = {
            spec_value_name: this.specificationArr[index].specificationItem,
            desc: this.specificationArr[index].desc
          }
          this.allSpecification.push(this.specificationArr[index].specificationItem)
          this.specificationArr[index].specificationMsg.push(obj)
          this.specificationArr[index].specificationItem = ''
          this.refreshTable()
        }
      }
    },
    handleAddSpecification() {
      const obj = {
        specificationName: this.specificationName,
        specificationItem: '',
        desc: `tab${this.count}`,
        specificationMsg: []
      }
      if (this.specificationName === '') {
        this.$message('请填写规格名称！')
      } else {
        if (JSON.stringify(this.specificationArr).indexOf(JSON.stringify(obj)) === 1) {
          this.$message('规格名称已存在！')
        } else {
          this.specificationArr.push(obj)
          this.specificationName = ''
        }
      }
      this.count += 1
    },
    refreshTable() {
      var $specObj = this.specificationArr
      var each_num = 0
      var $specArray = []
      _.forEach($specObj, (v, i) => {
        var arr_length = v.specificationMsg.length
        var each_spec_name = v.specificationName
        var spec_name_obj = { 'each_length': arr_length, 'spec_name': each_spec_name, 'value': v.specificationMsg, 'desc': v.desc }
        $specArray.push(spec_name_obj)
        if (each_num === 0) {
          each_num = arr_length
        } else {
          each_num = each_num * arr_length
        }
      })
      let $sku_array = []
      const $length = $specArray.length
      if ($length > 0) {
        var $spec_value_obj = $specArray[0]['value']
        _.forEach($spec_value_obj, (v, i) => {
          var $spec_value = v.spec_value_name
          var $desc = v.desc
          var $sku_obj = {}
          $sku_obj.specificationName = $spec_value
          $sku_obj.desc = $desc
          $sku_array.push($sku_obj)
        })
      }
      for (let $i = 1; $i < $length; $i++) {
        const $spec_val_obj = $specArray[$i]['value']
        const $length_val = $spec_val_obj.length
        const $sku_copy_array = []
        _.forEach($sku_array, (v, i) => {
          const $old_name = v.specificationName
          const $old_desc = v.desc
          for (let $y = 0; $y < $length_val; $y++) {
            var $name = $spec_val_obj[$y].spec_value_name
            var $desc = $spec_val_obj[$y].desc
            const $copy_obj = {}
            $copy_obj.specificationName = $old_name + ';' + $name
            $copy_obj.desc = $old_desc + ';' + $desc
            $sku_copy_array.push($copy_obj)
          }
        })
        $sku_array = $sku_copy_array
      }

      const sku_arr = []
      var name_arr = []
      var result = []
      _.forEach($sku_array, (val, index) => {
        const valueArr = val.specificationName.split(';')
        const nameArr = val.desc.split(';')
        sku_arr.push(valueArr)
        name_arr.push(nameArr)
      })
      var allLength = sku_arr[0].length * name_arr[0].length
      _.forEach(sku_arr, (v, i) => {
        var obj = {}
        for (let y = 0; y < allLength; y++) {
          if (name_arr[i][y]) {
            obj[name_arr[i][y]] = v[y]
            obj.inventory = 0
            obj.price = 0
            obj.addProportion = 0
            obj.addFixed = 0
            obj.renewProportion = 0
            obj.renewFixed = 0
          }
        }
        result.push(obj)
      })
      this.specificationTable = result
    },
    handleUploadSuccess(response, file, fileList) {
      this.product.image_uri = response.data.filepath
    },
    beforeImageUpload(file) {
      let isIMAGE = false
      if (file.type === 'image/jpeg' || file.type === 'image/gif' || file.type === 'image/png') {
        isIMAGE = true
      }
      if (!isIMAGE) {
        this.$message.error('上传文件只能是图片格式!')
      }
      return isIMAGE
    },
    handleRemoveImage(file, fileList) {
      this.product.image_uri = ''
    },
    handleSkip() {
      this.$router.push({ name: 'product' })
    },
    handleChange(value) {
      console.log(value)
    },
    arraySpanMethod({ row, column, rowIndex, columnIndex }) {
      if (rowIndex % 2 === 0) {
        if (columnIndex === 0) {
          return [1, 2]
        } else if (columnIndex === 1) {
          return [0, 0]
        }
      }
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (!this.now_col_row_num[column.property]) {
        if (!this.column_row_offset[column.property]) {
          return {
            rowspan: 1,
            colspan: 1
          }
        }
        this.now_col_row_num[column.property] = Object.assign([], this.column_row_offset[column.property])
        var x = this.now_col_row_num[column.property].shift()
        this.now_col_offset[column.property] = x
        return {
          rowspan: x,
          colspan: 1
        }
      } else if (rowIndex >= this.now_col_offset[column.property]) {
        var a = this.now_col_row_num[column.property].shift()
        this.now_col_offset[column.property] += a
        return {
          rowspan: a,
          colspan: 1
        }
      } else {
        return {
          rowspan: 0,
          colspan: 0
        }
      }
    },
    getProductCategory() {
      productCategory().then(res => {
        var classify = res.data.classify
        _.forEach(classify, (item, index) => {
          item.value = item.id
          item.label = item.classify_name
          if (item.hasOwnProperty('child')) {
            item.children = item.child
            _.forEach(item.child, (val, i) => {
              val.value = val.id
              val.label = val.classify_name
              if (val.hasOwnProperty('child')) {
                val.children = val.child
                _.forEach(val.child, (ele, y) => {
                  ele.value = ele.id
                  ele.label = ele.classify_name
                  if (ele.hasOwnProperty('child')) {
                    ele.children = ele.child
                  }
                })
              }
            })
          }
        })
        this.classify = classify
      })
    },
    getAllProductTag() {
      productTag().then(res => {
        console.log(res.data)
        _.forEach(res.data, (item, index) => {
          if (item.id === 3) {
            this.productTag = item.tag
          }
        })
      })
    },
    getAllPowerData() {
      allPowerData().then(res => {
        var powerData = res.data
        this.power = powerData
        this.firstId = powerData[0].id
        _.forEach(powerData, (item, index) => {
          switch (item.id) {
            case 2:
              this.network = item.power_detail
              this.networkId = item.power_detail[0].id
              break
            case 3:
              this.selectPart = item.power_detail
              this.partId = item.power_detail[0].id
              break
            case 4:
              this.selectTagGroup = item.power_detail
              this.tagGroupId = item.power_detail[0].id
              break
            case 5:
              this.selectTag = item.power_detail
              this.tagId = item.power_detail[0].id
              break
            default:
              this.power_id = 1
          }
        })
      })
    },
    createData() {
      this.$confirm('确认提交吗?', '提示', {
        type: 'warning'
      }).then(() => {
        var params = {
          name: this.add.name,
          introduce: this.add.introduce,
          price: this.add.price,
          addsizecommission: this.add.addProportion,
          addfixedcommission: this.add.addFixed,
          consizecommission: this.add.renewProportion,
          confixedcommission: this.add.renewFixed,
          content: this.add.content,
          stock: this.add.stock,
          company_id: this.add.company_id,
          product_img: this.add.product_img,
          one_classify_id: this.add.one_classify_id,
          two_classify_id: this.add.two_classify_id,
          three_classify_id: this.add.three_classify_id,
          need_server: this.add.need_server,
          power_id: this.add.power_id,
          banner_img: this.add.banner_img,
          tag: this.add.tag,
          size: this.add.size,
          size_describe: this.add.size_describe,
          limit: this.add.limit,
          link: this.add.link
        }
        console.log(params)
      })
    }
  }
}
</script>

<style scoped>
label {
  font-size: 14px;
  color: #606266;
}
.oneBill {
  padding: 10px 0;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.2);
  margin-bottom: 15px;
}
.card-item {
  margin-bottom: 15px;
}
.contColor {
  color: #606266;
}
i,
span {
  cursor: pointer;
}
.person_tit {
  margin-right: 15px;
  color: #ff7c00;
}
.components-container .el-dialog__wrapper .el-dialog {
  width: 80% !important;
}
.el-checkbox {
  margin-left: 30px;
  margin-bottom: 8px;
}
.issue {
  float: right;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}
.specification {
  padding: 10px;
  border: 1px solid #dbe2e7;
  background-color: #f4f7f9;
}
.specification-item {
  margin-right: 20px;
}
.box-card {
  width: 50%;
}
</style>


