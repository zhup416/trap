<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">总投放组：{{putIn.allCount}}</el-col>
        <el-col :span="8" class="data-li li2">正在投放数：{{putIn.nowCount}}</el-col>
        <el-col :span="8" class="data-li li2">已到期数：{{putIn.outCount}}</el-col>
      </el-row>
    </div>
    <div class="searchBox">
      <el-row>
        <el-col :span="6" class="search-li">
          <span>广告名称：</span>
          <el-input v-model="search.slideName" placeholder="请输入广告名称搜索" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="6" class="search-li">
          <span>所属网点：</span>
          <el-select v-model="search.netSpotId" placeholder="请选择网点">
            <el-option
              v-for="item in cityOptions"
              :key="item.id"
              :label="item.net_spot_name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="6" class="search-li">
          <span>状态：</span>
          <el-select v-model="search.status" placeholder="请选择">
            <el-option
              v-for="item in status"
              :key="item.code"
              :label="item.desc"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 0 0">
        <el-col :span="8" class="search-li">
          <span>显示时间：</span>
          <el-date-picker
            v-model="search.durTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd HH:mm:ss"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click.native="searchHandle(search)">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btn" style="margin: 20px 0">
      <el-button type="primary" @click="addSlideHandle">新增广告组</el-button>
    </div>
    <div class="people-list" v-loading="load">
      <el-table :data="newSlideList" stripe style="width: 100%;">
        <el-table-column align="center" prop="id" width="150" label="广告ID"></el-table-column>
        <el-table-column align="center" prop="group_name" label="广告名称"></el-table-column>
        <el-table-column align="center" prop="net_spot_name" label="所属网点"></el-table-column>
        <el-table-column align="center" prop="slide_number" label="广告数量"></el-table-column>
        <el-table-column align="center" prop="expire_time" label="显示时间">
          <template slot-scope="scope">
            <span>{{`${scope.row.begin}`+"到"+`${scope.row.end}`}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="显示">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status.code" @change="switchStatus(scope.row)" active-text="显示" inactive-text="隐藏"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editHandle(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="deleteHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageInfo.curPage"
          :limit.sync="pageInfo.pageSize"
          @pagination="getSlideGroupList"
        />
      </el-row>
    </div>
    <!-- 新增幻灯片组 -->
    <el-dialog :visible.sync="dialogPvVisible" :title="textMap">
      <div class="slideGroupMain">
        <el-row>
          幻灯片组名称：
          <el-input
            v-model="editSlideGroup.group.group_name"
            style="width:400px"
            placeholder="请输入幻灯片组名称"
          />
        </el-row>
        <el-row>
          所属网点：
          <el-checkbox-group class="netSpot" v-model="editSlideGroup.checkedCities" :min="1">
            <el-checkbox
              v-for="item in cityOptions"
              :label="item.id"
              :key="item.id"
            >{{item.net_spot_name}}</el-checkbox>
          </el-checkbox-group>
        </el-row>
        <el-row>
          <div class="block">
            <span class="demonstration">开始日期：</span>
            <el-date-picker
              v-model="editSlideGroup.group.begin"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
            ></el-date-picker>
          </div>
        </el-row>
        <el-row>
          <div class="block">
            <span class="demonstration">结束日期：</span>
            <el-date-picker
              v-model="editSlideGroup.group.end"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
            ></el-date-picker>
          </div>
        </el-row>
        <el-row>
          显示状态：
          <el-radio v-model="editSlideGroup.group.status" label="1">显示</el-radio>
          <el-radio v-model="editSlideGroup.group.status" label="0">隐藏</el-radio>
        </el-row>
        <el-row :gutter="20" class="row-item card-item">
          <el-card class="box-card" shadow="hover" style="width: 100%;">
            <div slot="header" class="clearfix">
              <span>上传幻灯片</span>
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
              :data="editSlideGroup.img"
              ref="editSlideGroup.img"
              tooltip-effect="dark"
              border
              stripe
              style="width: 100%"
              @selection-change="selectRow"
            >
              <el-table-column type="selection" width="45" align="center"></el-table-column>
              <el-table-column label="序号" type="index" width="60" align="center"></el-table-column>
              <el-table-column label="文件上传" align="center" width="200">
                <template scope="scope">
                  <el-upload
                    action
                    list-type="picture"
                    :http-request="fnUploadRequest"
                    :show-file-list="true"
                    :on-exceed="beyondFile"
                    :on-success="handleVideoSuccess"
                    :before-upload="beforeUploadVideo"
                  >
                    <el-button>点击上传</el-button>
                  </el-upload>
                </template>
              </el-table-column>
              <el-table-column label="关联链接">
                <template scope="scope">
                  <span>
                    <el-input v-model="scope.row.img_link" placeholder="请输入内容"></el-input>
                  </span>
                </template>
              </el-table-column>
            </el-table>
          </el-card>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle">取消</el-button>
        <el-button type="primary" @click="addHandle(editSlideGroup)">{{textMap2}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as city from "../../../utils/city-data";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import {
  slideGroupList,
  delSlideList,
  addAndEditSlide,
  slideManage,
  allNet,
  showEdit,
  showStatus
} from "@/api/dingpc/flatformManage";
// import { constants } from 'http2';
import oss from "@/utils/aliOss";
import { setTimeout } from "timers";
export default {
  directives: { elDragDialog },
  name: "index",
  data() {
    return {
      sort: "",
      input: "",
      loading: true,
      status: [{ desc: "显示", code: 1 }, { desc: "隐藏", code: 0 }],
      textMap: "",
      textMap2: "",
      currentPage: 1,
      dialogVisible: false,
      putIn: {},
      slideList: [],
      pageInfo: {
        curPage: 1,
        pageSize: 15
      },
      total: 0,
      selectedOptions: [],
      //城市列表
      cityOptions: [],
      //搜索幻灯片
      search: {
        slideName: "",
        status: "",
        netSpotId: "",
        durTime: ""
      },
      //新增幻灯片组
      dialogPvVisible: false,
      isIndeterminate: true,
      checkAll: false,
      slideGroup: {
        group: {
          group_name: "",
          status: "",
          begin: "",
          end: ""
        },
        img: [],
        netSpotId: []
      },
      selectlistRow: [],
      tableData: [],
      //编辑列表项
      editSlideGroup: {
        group: {
          group_name: "",
          status: "",
          begin: "",
          end: ""
        },
        img: [],
        checkedCities: []
      }
    };
  },
  computed: {
    newSlideList() {
      return [...this.slideList];
    },
    load() {
      return this.loading;
    }
  },
  methods: {
    //获取城市列表
    getCityList() {
      allNet().then(response => {
        if (response.code == 1) {
          console.log(response.data);
          response.data.forEach(ele => {
            this.cityOptions.push(ele);
          });
        }
      });
    },

    //获取幻灯片组列表
    getSlideGroupList() {
      this.loading = true;
      slideGroupList({
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.curPage
      }).then(response => {
        console.log(response);
        if (response.code == 1) {
          this.loading = false;
          this.slideList = [...response.data.items].reverse();
          this.putIn = { ...response.data };
          this.total = response.data.total;
        }
      });
    },
    //currentPage变化
    handleSizeChange(val) {
      console.log(val);
      this.getSlideGroupList();
    },
    handleCurrentChange(val) {
      console.log(val);
      this.getSlideGroupList();
    },
    //搜索幻灯片组
    searchHandle(msg) {
      // console.log(msg);
      slideGroupList({
        slideName: msg.slideName,
        netSpotId: msg.netSpotId,
        status: msg.status,
        begin: msg.durTime[0],
        end: msg.durTime[1],
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.curPage
      }).then(response => {
        if (response.code == 1) {
          if (response.data.items.length == 0) {
            this.$message.error("没有找到相应的幻灯片信息");
          }
          this.search = {
            slideName: "",
            status: "",
            netSpotId: "",
            durTime: ""
          };
        }
      });
    },
    //控制显示状态
    switchStatus(msg){
      // console.log(msg)
      showStatus({groupId:msg.id}).then((response)=>{
        if(response.code == 1){
          // console.log(response.data)
          console.log(response)
        }
      })
    },

    //上传幻灯片组
    async fnUploadRequest(option) {
      oss.ossUploadFile(option);
    },
    beforeUploadVideo(file) {
      let isIMAGE = false;
      if (
        file.type === "image/jpeg" ||
        file.type === "image/gif" ||
        file.type === "image/png"
      ) {
        isIMAGE = true;
      }
      if (!isIMAGE) {
        this.$message.error("上传文件只能是图片格式!");
      }
      return isIMAGE;
    },
    // 上传成功后
    handleVideoSuccess(response, file, fileList) {
      if (typeof response !== "undefined") {
        console.log(response);
        // this.editSlideGroup.img_url = response.res.requestUrls[0];
        var len = this.editSlideGroup.img.length;
        this.editSlideGroup.img[len - 1].img_url = response.name;

        // this.editSlideGroup.img.shift();
        // this.editSlideGroup.img.push(imgObj);
      }
    },
    // 添加多个文件事件
    beyondFile(files, fileList) {
      this.$message({
        message: "最多上传" + fileList.length + "张图片",
        type: "error"
      });
    },

    //删除某一幻灯片组
    deleteHandle(msg) {
      console.log(msg);
      delSlideList({ groupId: msg.id }).then(response => {
        // console.log(msg);
        if (response.code == 1) {
          this.getSlideManageList();
        }
      });
    },

    handleCurrentChange(val) {
      this.loading = true;
      this.pageInfo.curPage = val;
    },
    //编辑行
    editHandle(msg) {
      // console.log(row)
      this.textMap = "编辑幻灯片组";
      this.textMap2 = "确定修改";
      this.dialogPvVisible = true;
      var param = {
        groupId: msg.id
      };
      // console.log(param)
      showEdit(param).then(response => {
        console.log(response.data);
        if (response.code == 1) {
          this.editSlideGroup = {
            group: {
              group_name: response.data.group.group_name,
              status: response.data.group.status,
              begin: response.data.group.begin,
              end: response.data.group.end
            },
            img: [...response.data.img],
            checkedCities: [...response.data.netSpotId]
          };
        }
        console.log(this.editSlideGroup);
      });
    },
    //新增幻灯片组
    addSlideHandle() {
      this.sort = 0;
      this.dialogPvVisible = true;
      this.textMap = "新增幻灯片组";
      this.textMap2 = "确定添加";
      this.editSlideGroup = {
        group: {
          group_name: "",
          status: "",
          begin: "",
          end: ""
        },
        img: [],
        checkedCities: []
      };
    },
    // 确认添加幻灯片组
    addHandle(msg) {
      console.log(msg);
      this.dialogPvVisible = false;
      addAndEditSlide({
        slideName: msg.group.group_name,
        netSpotId: [...msg.checkedCities].toString(),
        begin: msg.group.begin,
        end: msg.group.end,
        slide: msg.img,
        status: msg.group.status.toString()
      }).then(response => {
        if (response.code == 1) {
          console.log(response);
          this.getSlideGroupList();
          this.sort = 0;
        }
      });
    },
    cancleHandle() {
      this.dialogPvVisible = false;
    },
    selectRow(val) {
      // console.log(val);
      this.selectlistRow = val;
    },
    // 增加行
    addRow() {
      this.sort++;
      var list = {
        img_url: "",
        img_link: "",
        img_sort: this.sort
      };
      this.editSlideGroup.img.push(list);
    },
    // 删除选中行
    delData() {
      for (let i = 0; i < this.selectlistRow.length; i++) {
        const val = this.selectlistRow;
        // 获取选中行的索引的方法
        // 遍历表格中tableData数据和选中的val数据，比较它们的rowNum,相等则输出选中行的索引
        // rowNum的作用主要是为了让每一行有一个唯一的数据，方便比较，可以根据个人的开发需求从后台传入特定的数据
        console.log(val);
        val.forEach((val, index) => {
          this.editSlideGroup.img.forEach((v, i) => {
            // console.log(this.slideGroup.relatedData)
            if (val.rowNum === v.rowNum) {
              // i 为选中的索引
              this.editSlideGroup.img.splice(i, 1);
            }
          });
        });
      }
      // 删除完数据之后清除勾选框
      this.$refs.editSlideGroup.img.clearSelection();
    }
  },
  created() {
    this.getSlideGroupList();
    this.getCityList();
  }
};
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
.searchBox {
  padding: 10px;
  border: 1px solid #e1e1e1;
  box-shadow: 0 0 3px #ededee;
  margin: 20px 10px;
}
.tag-row {
  margin: 30px 0 20px 0;
}
.tag-list {
  cursor: pointer;
  margin: 0 5px;
}
.pageBox {
  margin: 30px;
}
.addBtn {
  margin: 10px 0 20px 0;
}
.el-dialog .el-row {
  margin: 10px 0;
}
.slideGroupMain {
  margin: -10px 50px 10px;
}
.addFile {
  border: none !important;
  outline: none !important;
}
.netSpot {
  display: inline;
}
</style>
