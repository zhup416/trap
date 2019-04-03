<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">总投放数：{{ putIn.allCount }}</el-col>
        <el-col :span="8" class="data-li li2">正在投放数：{{ putIn.nowCount }}</el-col>
        <el-col :span="8" class="data-li li2">已到期数：{{ putIn.outCount }}</el-col>
      </el-row>
    </div>

    <div class="searchBox">
      <el-row>
        <el-col :span="6" class="search-li">
          <span>广告名称：</span>
          <el-input v-model="BannerManner.bannerName" placeholder="请输入广告名称搜索" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="6" class="search-li">
          <span>所属网点：</span>
          <el-select v-model="BannerManner.netSpotId" placeholder="请选择">
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
          <el-select v-model="BannerManner.status" placeholder="请选择">
            <el-option
              v-for="item in stateStatus"
              :key="item.id"
              :label="item.status"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row style="margin: 20px 0 0 0">
        <el-col :span="8" class="search-li">
          <span>显示时间：</span>
          <el-date-picker
            v-model="BannerManner.durTime"
            type="daterange"
            align="right"
            unlink-panels
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click.native="search(BannerManner)">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btn" style="margin: 20px 0">
      <el-button type="primary" @click="createAdhandle">新增广告</el-button>
    </div>
    <div class="people-list" v-loading="loading">
      <el-table :data="adList" stripe style="width: 100%;">
        <el-table-column width="150" label="广告ID" prop="id"></el-table-column>
        <el-table-column prop="name" label="广告名称"></el-table-column>
        <el-table-column prop="net_spot_name" label="所属网点"></el-table-column>
        <el-table-column label="显示时间">
          <template scope="scope">
            <span>{{scope.row.begin && scope.row.end ?scope.row.begin+ "到"+ scope.row.end : " " }}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示">
          <template scope="scope">
             <el-switch v-model="scope.row.status.code" @change="switchStatus(scope.row)" active-text="显示" inactive-text="隐藏"></el-switch>
          </template>
        </el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editHandle(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delAdHandle(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-col class="pageBox" :span="6">
          <el-pagination
          v-show="total > 0"
          :total="total"
          :page.sync="pageInfo.curPage"
          :limit.sync="pageInfo.pageSize"
          @pagination="getAdLists"
        />
        </el-col>
      </el-row>
    </div>
    <!-- 新增广告 -->
    <el-dialog :visible.sync="dialogPvVisible" :title="textMap">
      <div class="BannerManner">
        <el-row>
          广告名称：
          <el-input v-model="BannerManner.bannerName" style="width:400px" placeholder="请输入广告名称"/>
        </el-row>
        <el-row>
          所属网点：
          <el-checkbox-group style="display:inline" v-model="BannerManner.checkedCities" :min="1">
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
              v-model="BannerManner.begin"
              value-format="yyyy-MM-DD"
              type="date"
              placeholder="选择开始日期"
            ></el-date-picker>
          </div>
        </el-row>
        <el-row>
          <div class="block">
            <span class="demonstration">结束日期：</span>
            <el-date-picker
              v-model="BannerManner.end"
              value-format="yyyy-MM-DD"
              type="date"
              placeholder="选择结束日期"
            ></el-date-picker>
          </div>
        </el-row>
        <el-row>
          显示状态：
          <el-radio v-model="BannerManner.status" label="1">显示</el-radio>
          <el-radio v-model="BannerManner.status" label="0">隐藏</el-radio>
        </el-row>
        <el-row>
          广告链接：
          <el-input v-model="BannerManner.link" style="width:400px" placeholder="请输入广告链接"/>
        </el-row>
        <el-row>
          <el-upload
            action
            list-type="picture"
            :http-request="fnUploadRequest"
            :show-file-list="true"
            :on-exceed="beyondFile"
            :on-success="handleVideoSuccess"
            :before-upload="beforeUploadVideo"
          >
            广告图片：
            <el-button size="small" type="primary">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
          </el-upload>
        </el-row>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleHandle">取消</el-button>
        <el-button type="primary" @click="addBannerHandle(BannerManner)">{{textMap2}}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import * as city from "../../../utils/city-data";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { getOrderList } from "@/api/dingpc/UnAuditedOrder";
import {
  showEditBanner,
  showBannerManner,
  delBanner,
  showNet,
  addBanner,
  editBanner,
  showAdStatus
} from "@/api/dingpc/flatformManage";
import { error } from "util";
import oss from "@/utils/aliOss";
// import { constants } from 'http2';
export default {
  directives: { elDragDialog },
  name: "index",
  data() {
    return {
      total: 0,
      textMap: "",
      textMap2: "",
      loading: true,
      bannerId:'',
      stateStatus: [{ id: 1, status: "显示" }, { id: 0, status: "隐藏" }],
      total:15,
      pageInfo: {
        curPage: 1,
        pageSize: 15,
      },
      cityOptions: [],
      putIn: {},
      selectedOptions: [],
      adList: [],

      //新增广告
      checkAll: false,
      isIndeterminate: true,
      dialogPvVisible: false,
      BannerManner: {
        img: [],
        checkedCities: [],
        status: "",
        bannerName: "",
        link: "",
        begin: "",
        end: "",
        durTime: "",
        bannerImg: "",
        netSpotId: ""
      }
    };
  },
  methods: {
    //获取广告列表
    getCityList() {
      showNet().then(response => {
        this.cityOptions = [...response.data];
      });
    },
    getAdLists() {
      showBannerManner({
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.curPage
      }).then(response => {
        console.log(response)
        this.loading = false;
        this.putIn = {
          allCount: response.data.allCount,
          nowCount: response.data.nowCount,
          outCount: response.data.outCount
        };
        this.adList = [...response.data.items].reverse();
        this.total = response.data.total
      });
    },
    //改变标签页
    handleCurrentChange(val) {
      this.loading = true;
      this.pageInfo.curPage = val;
      this.getAdLists()
    },

    //搜素广告
    search(msg) {
      this.loading = true;
      var netSpotId = msg.netSpotId.toString();
      showBannerManner({
        bannerName: msg.bannerName,
        status: msg.status,
        netSpotId: netSpotId,
        begin: msg.durTime[0],
        end: msg.durTime[1],
        limit: this.pageInfo.pageSize,
        page: this.pageInfo.curPage
      }).then(response => {
        this.loading = false;
        if (response.code == 1 && response.data.items.length > 0) {
          this.adList = [...response.data.items];
        } else {
          this.$message.error({
            type: "warning",
            message: "没有找到相应的数据!"
          });
          this.getAdLists();
        }
      });
    },
     switchStatus(msg){
       console.log(msg)
      showAdStatus({
        bannerId:msg.id
      }).then((response)=>{
        console.log(response)
      })
    },
    orderDel(index, row) {
      this.$confirm("是否删除 " + row.name + " ?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {});
    },

    // 上传图片
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
        // console.log(response);
        this.BannerManner.bannerImg = response.res.requestUrls[0];
        // this.BannerManner.img.push(response);
      }
    },
    // 添加多个文件事件
    beyondFile(files, fileList) {
      this.$message({
        message: "最多上传" + fileList.length + "张图片",
        type: "error"
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    createAdhandle(msg) {
      this.textMap = "新增广告";
      this.textMap2 = "确认添加";
      this.dialogPvVisible = true;
      this.BannerManner = {
        checkedCities: [],
        status: "",
        bannerName: "",
        link: "",
        begin: "",
        end: "",
        durTime: "",
        bannerImg: "",
        netId: ""
      };
    },

    addBannerHandle(msg) {
      this.dialogPvVisible = false;
      if(this.textMap2 == '确认添加'){
        console.log(msg)
        addBanner({
        bannerName: msg.bannerName,
        begin: msg.begin,
        end: msg.end,
        link: msg.link,
        bannerImg: msg.bannerImg,
        netSpotId: [...msg.checkedCities].toString()
      }).then(response => {
        if (response.code == 1) {
          this.getAdLists();
        }
      })
      }else{
        editBanner({
          bannerName: msg.bannerName,         
          begin:msg.begin,
          end:msg.end,
          link:msg.link,
          bannerImg:msg.bannerImg,
          netSpotId:[...msg.checkedCities].toString(),
          bannerId:this.bannerId,
        }).then((response)=>{
          if (response.code == 1) {
          this.getAdLists();
        }
        })
      }
      
    },
    cancleHandle() {
      this.dialogPvVisible = false;
    },
    editHandle(msg) {
      this.textMap = "编辑广告";
      this.textMap2 = "确认修改";
      this.dialogPvVisible = true;
      showEditBanner({
        bannerId: msg.id
      }).then(response => {

        if (response.code == 1) {
          this.bannerId = msg.id
          this.BannerManner = {
            checkedCities: [...response.data.netSpotId],
            status: "",
            bannerName: response.data.banner.name,
            link: response.data.banner.img_link,
            begin: response.data.banner.begin,
            end: response.data.banner.end,
            durTime: "",
            bannerImg: response.data.banner.img_url,
            netId: ""
          }
        }
      });
    },
    //删除广告图
    delAdHandle(msg) {
      delBanner({
        bannerId: msg.id
      }).then(response => {
        if (response.code == 1) {
          this.getAdLists();
        }
      });
    }
  },
  computed: {},
  created() {
    this.getAdLists();
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
/* 新增广告 */
.el-dialog .el-row {
  margin: 10px 0;
}
.BannerManner {
  margin: -10px 50px 0;
}
</style>
