<template>
  <div class="cantainer">
    <div style="border-bottom:1px solid black;padding:50px">
      <el-row>
        试题名称：
        <el-input v-model="testName" style="width:600px" placeholder="请输入试题名称"></el-input>
      </el-row>
      <el-row style="margin-top:20px">
        总结设置：
        <el-button type="primary" @click="addSummaryHandle">+ 添加总结项</el-button>
      </el-row>
      <el-row style="margin-top:20px">
        <el-table :data="tableData" style="width: 100%">
          <el-table-column label="分值区间" width="280">
            <template scope="scope">
              <div>
                <el-input-number
                  size="mini"
                  v-model="scope.row.minVal"
                  :max="100"
                  style="width:100px"
                ></el-input-number>—
                <el-input-number
                  size="mini"
                  v-model="scope.row.maxVal"
                  :max="100"
                  style="width:100px"
                ></el-input-number>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="结论表述" align="center" width="600">
            <template scope="scope">
              <div>
                <el-input type="textarea" autosize placeholder="请输入内容" v-model="scope.row.summary"></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="删除" align="center" width="100">
            <template scope="scope">
              <div>
                <el-button type="danger" round @click="delSummaryItemHandle(scope.$index)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row style="margin-top:20px">
        <el-row style="font-size:16px">
          <span class="before"/>基本信息设置
          <el-button
            style="margin-left:50px"
            size="small"
            type="primary"
            round
            @click="addBaseHandle"
          >+ 添加</el-button>
        </el-row>
        <el-row>
          <el-table :data="baseData" style="width: 100%">
            <el-table-column label="控件名称" width="280">
              <template scope="scope">
                <div>
                  <el-input
                    v-model="scope.row.name"
                    :placeholder=" scope.row.placeholder ? scope.row.placeholder : '请输入控件名称'"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="请输入对应的内容" align="center" width="600">
              <template scope="scope">
                <div>
                  <el-input
                    :placeholder="scope.row.placeholder ? '请输入' + scope.row.placeholder :'请输入内容'"
                    v-model="scope.row.value"
                  ></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="删除" align="center" width="100">
              <template scope="scope">
                <div>
                  <el-button
                    v-show="scope.row.placeholder ? false : true"
                    type="danger"
                    round
                    @click="delBaseItemHandle(scope.$index)"
                  >删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-row>

      <!-- 维度 -->
      <el-row style="margin-top:20px">
        <el-row style="font-size:16px">
          <span class="before"/>维度
          <el-button
            type="primary"
            round
            size="small"
            style="margin-left:114px"
            @click="createdimension"
          >+ 维度</el-button>
        </el-row>

        <div v-for="(Item , index) in dimension" :key="Item.dimensionName">
          <el-row style="margin-top:20px">
            <div style="margin-left:50px">
              {{Item.dimensionName}}
              <el-select
                v-model="Item.optionType"
                placeholder="选择选项类型"
                style="width:160px;margin-left:160px"
                size="mini"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-button type="primary" size="mini" round @click="addQueHandle(index)">添加</el-button>
            </div>
            <el-row style="margin-left:100px;margin-top:15px">
              <div v-for=" (item,inde) in Item.optionsItemsList" :key="item.optionName">
                <span>{{item.optionName}} :</span>
                <el-radio-group>
                  <el-radio
                    :label="ele.inputVal"
                    v-for="(ele) in item.optionsList"
                    :key="ele.inputVal"
                  >{{ele.inputVal}}-{{ele.optionNum}}分</el-radio>
                  <el-button type="danger" icon="el-icon-delete" circle size="mini" @click="delRadioHandle(inde)"></el-button>
                </el-radio-group>
              </div>
            </el-row>
          </el-row>
        </div>
      </el-row>

      <!-- 弹框 -->

      <!-- 创建维度 -->
      <el-row>
        <el-dialog :visible.sync="dialogPvVisible" title="创建维度">
          <div style="padding-left:50px">
            <div>
              维度名称：
              <el-input
                v-model="dimensionObj.dimensionName"
                style="width:400px"
                placeholder="请输入维度名称"
              ></el-input>
            </div>
            <div style="margin-top:28px">
              标准分数：
              <el-input-number v-model="dimensionObj.scoreNum" controls-position="right"></el-input-number>
            </div>
            <div style="margin-top:28px">
              维度设置：
              <el-button type="primary" round size="mini" @click="addSummary">+ 添加总结项</el-button>
            </div>
            <div>
              <el-table :data="dimensionObj.scoreDescribe" style="width: 100%">
                <el-table-column label="分值区间" width="280">
                  <template scope="scope">
                    <div>
                      <el-input-number size="mini" v-model="scope.row.minVal" style="width:100px"></el-input-number>—
                      <el-input-number size="mini" v-model="scope.row.maxVal" style="width:100px"></el-input-number>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="结论表述" align="center" width="400">
                  <template scope="scope">
                    <div>
                      <el-input
                        type="textarea"
                        autosize
                        placeholder="请输入内容"
                        v-model="scope.row.summary"
                      ></el-input>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column label="删除" align="center" width="100">
                  <template scope="scope">
                    <div>
                      <el-button
                        type="danger"
                        icon="el-icon-delete"
                        circle
                        @click="delScoreDesItemHandle(scope.$index)"
                      ></el-button>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addDimensionHandle(dimensionObj)">确认添加</el-button>
          </span>
        </el-dialog>
        <!-- 问题选项 -->
        <el-dialog :visible.sync="showDialog" title="选项控件">
          <div style="padding-left:50px">
            选项名称：
            <el-input v-model="newOptions.optionName" style="width:400px" placeholder="请输入选项名称"></el-input>
          </div>
          <div style="padding-left:50px;margin-top:25px">
            选项：
            <el-button style="margin-left:400px" @click="addMoreOptionHandle">增加选项</el-button>
            <el-row v-for="(item,index) in newOptions.optionsList" :key="index">
              <el-input
                v-model="item.inputVal"
                style="width:400px;margin-top:10px"
                placeholder="请输入选项内容"
              ></el-input>——
              <el-input-number size="small" v-model="item.optionNum"></el-input-number>分
              <el-button
                type="danger"
                style="margin-left:40px"
                icon="el-icon-delete"
                circle
                @click="delOptionItemHandle(index)"
              ></el-button>
            </el-row>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="addQuestionHandle(newOptions)">确认添加</el-button>
          </span>
        </el-dialog>
      </el-row>
    </div>
    <div style="text-align:center;margin-top:40px">
      <el-button @click="cencleHandle">取消</el-button>&nbsp;&nbsp;&nbsp;&nbsp;
      <el-button type="primary" @click="generateQuestionnaire">生成问卷</el-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      index:'',
      dimensionIndex:-1,
      testName: "",
      dialogPvVisible: false,
      showDialog: false,
      // minVal:'',
      // maxVal:'',
      // summary:'',
      radio2: 3,
      tableData: [],
      baseData: [{ name: "", value: "", placeholder: "姓名" }],
      dimension: [],
      dimensionItem: [],
      dimensionObj: {
        scoreDescribe: [],
        dimensionName: "",
        score: ""
      },
      option: "",
      // optionType:'',
      options: [
        {
          value: "1",
          label: "单选项"
        },
        {
          value: "0",
          label: "多选项"
        }
      ],
      newOptions: {
        optionName: "",
        optionsList: [{}, {}]
      },
      // optionsItemsList: []
    };
  },
  methods: {
    addSummaryHandle() {
      this.tableData.push({
        minVal: "",
        maxVal: "",
        summary: ""
      });
    },
    delSummaryItemHandle(i) {
      this.tableData.splice(i, 1);
    },
    delBaseItemHandle(i) {
      this.baseData.splice(i, 1);
    },
    addBaseHandle() {
      this.baseData.push({
        name: "",
        value: ""
      });
    },
    createdimension() {
      this.dialogPvVisible = true
      this.dimensionObj = {
        scoreDescribe: [],
        dimensionName: "",
        scoreNum: null,
      }
    },

    addDimensionHandle(msg) {
      this.dimensionIndex ++
      this.dialogPvVisible = false
      var list = { ...msg , optionsItemsList:[]}
      this.dimension.push(list)
    },
    delScoreDesItemHandle(i) {
      this.dimensionObj.scoreDescribe.splice(i, 1);
    },

    addQueHandle(i) {
      this.index = i
      this.showDialog = true;
      this.newOptions = {
        optionName: "",
        optionsList: [{}, {}]
      };
    },
    addQuestionHandle(msg) {
      this.showDialog = false;
      // this.optionsItemsList.push(msg);
      console.log(msg , this.dimensionIndex)
      this.dimension[this.dimensionIndex].optionsItemsList.push(msg)
    },
    delRadioHandle(i){
      this.dimension[this.dimensionIndex].optionsItemsList.splice(i,1)
    },
    addSummary() {
      var list = {}
      this.dimensionObj.scoreDescribe.push(list)
    },
    addMoreOptionHandle() {
      this.newOptions.optionsList.push({})
    },
    delOptionItemHandle(i) {
      this.newOptions.optionsList.splice(i, 1)
    },
    cencleHandle(){
      this.$router.push({name:'healthIndex'})
    },
    generateQuestionnaire(){
      console.log(this.dimension,this.testName,this.tableData,this.baseData)
      var report = {}
      this.$router.push({name:'healthIndex'})
    }

  },
};
</script>

<style scoped>
.before {
  display: inline-block;
  width: 5px;
  height: 12px;
  background-color: blue;
  margin-right: 10px;
}
</style>
