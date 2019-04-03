<template>
  <div class="container">
    <el-row>
      报告名称：
      <el-input v-model="reportName" style="width:400px" placeholder="请输入报告名称"></el-input>
      <el-button type="primary">搜索</el-button>
    </el-row>
    <div style="margin-top:50px"></div>
    <el-row>
      <el-table :data="reports" border style="width: 100%">
        <el-table-column prop="create_time" label="使用时间" width="180"></el-table-column>
        <el-table-column prop="title" label="报告名称" width="180"></el-table-column>
        <el-table-column prop="user_nickname" label="报告对象"></el-table-column>
        <el-table-column prop="user_nickname" label="创建人"></el-table-column>
        <el-table-column prop="net_spot_name" label="所属网点"></el-table-column>
        <el-table-column label="报告内容">
          <template scope="scope">
            <div>
              <el-button @click="takeDetails(scope.row)">查看</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-row>
    <el-row style="text-align:center;margin-top:30px">
      <el-pagination
        v-show="total > 0"
        :total="total"
        :page.sync="pageInfo.curPage"
        :limit.sync="pageInfo.pageSize"
        @pagination="getReports"
      />
    </el-row>
    <el-row>
      <el-dialog :visible.sync="dialogPvVisible"  title="报告详情">
        <el-row style="padding:0 30px 30px;text-align:center;border-bottom:2px solid black">
            <el-col class="detail" :span="5">
                <el-row>姓名</el-row><br>
                <el-row>{{}}</el-row>
            </el-col >
            <el-col  class="detail" :span="5">
                <el-row>所在公司</el-row><br>
                <el-row>{{}}</el-row>
            </el-col>
            <el-col  class="detail" :span="5">
                <el-row>年龄</el-row><br>
                <el-row>{{}}</el-row>
            </el-col>
            <el-col :span="5">
                <el-row>测评时间</el-row><br>
                <el-row>{{}}</el-row>
            </el-col>
        </el-row>
        <el-row>
            <el-row><span class="before"/>健诊结果总览</el-row>
            <el-row class="scoreCenter">
                <div class="scoreCircle">
                    <div>总得分</div>
                    <div>{{"95"}}</div>
                    <div>总分100分</div>
                </div>
            </el-row>
        </el-row>
        <el-row>

        </el-row>
      </el-dialog>
    </el-row>
  </div>
</template>

<script>
import { reportList, takeDetails } from "@/api/dingpc/saleToll";
export default {
  data() {
    return {
      total: 0,
      dialogPvVisible:false,
      reportName: "",
      pageInfo: {
        curPage: 1,
        pageSize: 15
      },
      reports: [],
      detailForm:{}
    //   id:'',
    //   title:'',
    //   describe:'',
    //   total_score:'',
    //   score:'',
    //   create_time:'',
    };
  },
  created() {
    this.getReports();
  },
  methods: {
    getReports() {
      reportList().then(respone => {
        this.reports = [...respone.data.items];
        this.total = respone.data.total;
      });
    },
    takeDetails(msg) {
        this.dialogPvVisible = true
      takeDetails({ report_id: msg.id }).then(respone => {
        this.detailForm = {...respone.data}
        console.log(respone)
      });
    }
  }
};
</script>

<style scoped>
.container {
  padding: 50px;
}
.detail{   
}
.scoreCircle{
    margin-top:25px;
    margin: 25px auto;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background-color: aquamarine;
    line-height: 35px;
    text-align: center;
    
}
.before{
    display: inline-block;
    width: 5px;
    height: 12px;
    background-color: blue;
    margin-right: 5px;
    margin-top: 15px
}
.scoreCenter{
    text-align: center
}
</style>
