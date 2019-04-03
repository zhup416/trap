<template>
  <div class="app-container">
    <div class="all-data">
      <el-row>
        <el-col :span="8" class="data-li li1">报告模板数：{{reportTemplate.totalTest}}</el-col>
        <el-col :span="8" class="data-li li2">使用次数：{{reportTemplate.totalUsed}}</el-col> 
      </el-row>
    </div>

    <div class="searchBox">
      <el-row>
        <el-col :span="6" class="search-li">
          <span>报告名称：</span>
          <el-input v-model="reportName" placeholder="请输入报告名称" style="width: 60%"></el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary" @click.native="search(reportName)">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <div class="btn" style="margin: 20px 0">
      <el-button type="primary" @click="addReportHandle">添加报告</el-button>
    </div>
    <div class="people-list" v-loading="loading">
      <el-table :data="testList" stripe style="width: 100%;">
        <el-table-column prop="title" width="150" label="报告名称"></el-table-column>
        <el-table-column prop="totalScore" label="总分"></el-table-column>
        <el-table-column prop="testUsed" label="使用次数"></el-table-column>
        <el-table-column width="300px" label="操作">
          <template slot-scope="scope">
            <el-button size="mini" @click="editHandle(scope.row)">编辑</el-button>
            <el-button size="mini" type="danger" @click="delHealthHandle(scope.row)">删除</el-button>
            <el-button size="mini" type="primary"><router-link :to="{name:'reports'}">报告列表</router-link></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row type="flex" justify="center">
        <el-col class="pageBox" :span="6">
          <el-pagination
            v-show = "pageInfo.total > 0"
            background
            @current-change="handleCurrentChange"
            :current-page="pageInfo.curPage"
            :page-size="pageInfo.pageSize"
            layout="prev, pager, next"
            :total="pageInfo.total"
          ></el-pagination>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
import * as city from "../../../utils/city-data";
import elDragDialog from "@/directive/el-dragDialog"; // base on element-ui
import { 
  allHealthTest,
  showEdit, 
  reportList,
  delHealth
} from "@/api/dingpc/saleToll";
export default {
  directives: { elDragDialog },
  name: "index",
  data() {
    return {
      reportName:'',
      reportTemplate: {
        totalTest: "",
        totalUsed: ""
      },
      loading: true,
      pageInfo: {
        curPage: 1,
        pageSize: 5,
        total: 10
      },
      testList:[],
      // testList: {
      //   id: '',
      //   title: "",
      //   testUsed: '',
      //   totalScore: ''
      // },
      selectedOptions: []
    };
  },
  methods: {
    //获取试题列表
    getTestList() {
      this.loading = true
      allHealthTest().then((respone)=>{
        // console.log(respone)
        if(respone.code == 1){
          this.loading = false
          this.reportTemplate = {
            totalTest:respone.data.totalTest,
            totalUsed:respone.data.totalUsed
          }
          this.testList = [...respone.data.items]
          this.pageInfo.total = respone.data.total
        } 
      })
    },
    //添加报告
    addReportHandle(){
      this.$router.push('addReport')
    },
    handleCurrentChange(val) {
      this.loading = true;
      this.pageInfo.curPage = val;
    },
    search(msg) {
      this.loading = true;
      this.pageInfo.curPage = 1;
      allHealthTest({
        query:msg,
        page:this.pageInfo.curPage,
        limit:this.pageInfo.pageSize
      }).then((respone)=>{
      
        if(respone.code == 1){
          this.loading = false
          this.testList = [...respone.data.items]
        }else{
          this.$message.error({
            type:'warning',
            message:'没有找到相应的内容'     
          })
        }
      })

    },
    //编辑试题
    editHandle(msg){
      // console.log(msg)
      showEdit({test_id:msg.id}).then((respone)=>{
          if(respone.code == 1){
            this.$router.push({name:'addReport'})
          }
      })
    },
    //删除试题
    delHealthHandle(msg){
      console.log(msg)
      delHealth({test_id:msg.id}).then((respone)=>{})
    }
  },
  created() {
    this.getTestList()
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
</style>
