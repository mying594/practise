<template>
  <div>
    <div class="table1">
      <div v-for="(item,index) in todos" :key="index" class="table-main">
        <!-- :class="{'table-scale':islarge===index}" -->
        <el-table
          border
          :data="item.tableData"
          style="flex:1;  flex-wrap: wrap;"
          size="mini"
          :fit="false"
          @row-dblclick="scale($event,item)"
        >
          <el-table-column :label="item.title" align="center">
            <el-table-column prop="time" label="时间" width="63%" align="center"></el-table-column>
            <el-table-column
              :prop="time"
              :label="time"
              width="63%"
              v-for="(time, tindex) in timeColumn"
              :key="tindex"
              align="center"
            >
              <template slot-scope="scope">
                <span
                  v-if="parseFloat(scope.row[time])-parseFloat(scope.row[time+'a'])>2"
                  class="high"
                >{{scope.row[time]}}</span>
                <span
                  v-else-if="parseFloat(scope.row[time])-parseFloat(scope.row[time+'a'])<-2"
                  class="low"
                >{{scope.row[time]}}</span>
                <span v-else>{{scope.row[time]}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="area" width="63%" align="center">
              <template slot="header">
                <span>误差</span>
                <br />
                <span>范围</span>
              </template>
            </el-table-column>
            <el-table-column prop="midium" width="63%" align="center">
              <template slot="header">
                <span>误差</span>
                <br />
                <span>中数</span>
              </template>
            </el-table-column>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog
      :title="islarge.title"
      :visible.sync="islarge"
      width="100%"
      fullscreen
      :before-close="handleClose"
    >
      <el-table border :data="islarge.tableData">
        <el-table-column prop="time" label="时间" align="center"></el-table-column>
        <el-table-column
          :prop="time"
          :label="time"
          v-for="(time, tindex) in timeColumn"
          :key="tindex"
          align="center"
        >
          <template slot-scope="scope">
            <span
              v-if="parseFloat(scope.row[time])-parseFloat(scope.row[time+'a'])>2"
              class="high"
            >{{scope.row[time]}}</span>
            <span
              v-else-if="parseFloat(scope.row[time])-parseFloat(scope.row[time+'a'])<-2"
              class="low"
            >{{scope.row[time]}}</span>
            <span v-else>{{scope.row[time]}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="area" align="center">
          <template slot="header">
            <span>误差</span>
            <br />
            <span>范围</span>
          </template>
        </el-table-column>
        <el-table-column prop="midium" align="center">
          <template slot="header">
            <span>误差</span>
            <br />
            <span>中数</span>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeColumn: [
        "05-20",
        "05-08",
        "04-20",
        "04-08",
        "03-20",
        "03-08",
        "02-20",
        "02-08",
        "01-20",
        "01-08"
      ],
      todos: [
        {
          title: "表1",
          tableData: [
            {
              time: "瓮安",
              "05-20a": "9.0",
              "05-08a": "23.3",
              "05-20": "11.5",
              "05-08": "20.3",
              "04-20a": "10.0",
              "04-20": "11.0"
            },
            {
              time: "福泉"
            },
            {
              time: "贵定"
            },
            {
              time: "龙里"
            },
            {
              time: "惠水"
            },
            {
              time: "长顺"
            },
            {
              time: "罗甸"
            },
            {
              time: "平塘"
            },
            {
              time: "独山"
            },
            {
              time: "荔波"
            },
            {
              time: "三都"
            },
            {
              time: "都匀"
            }
          ]
        },
        {
          title: "表2",
          tableData: [
            {
              time: "瓮安"
            },
            {
              time: "福泉"
            },
            {
              time: "贵定"
            },
            {
              time: "龙里"
            },
            {
              time: "惠水"
            },
            {
              time: "长顺"
            },
            {
              time: "罗甸"
            },
            {
              time: "平塘"
            },
            {
              time: "独山"
            },
            {
              time: "荔波"
            },
            {
              time: "三都"
            },
            {
              time: "都匀"
            }
          ]
        },
        {
          title: "表3",
          tableData: [
            {
              time: "瓮安"
            },
            {
              time: "福泉"
            },
            {
              time: "贵定"
            },
            {
              time: "龙里"
            },
            {
              time: "惠水"
            },
            {
              time: "长顺"
            },
            {
              time: "罗甸"
            },
            {
              time: "平塘"
            },
            {
              time: "独山"
            },
            {
              time: "荔波"
            },
            {
              time: "三都"
            },
            {
              time: "都匀"
            }
          ]
        },
        {
          title: "表4",
          tableData: [
            {
              time: "瓮安"
            },
            {
              time: "福泉"
            },
            {
              time: "贵定"
            },
            {
              time: "龙里"
            },
            {
              time: "惠水"
            },
            {
              time: "长顺"
            },
            {
              time: "罗甸"
            },
            {
              time: "平塘"
            },
            {
              time: "独山"
            },
            {
              time: "荔波"
            },
            {
              time: "三都"
            },
            {
              time: "都匀"
            }
          ]
        }
      ],

      islarge: false
    };
  },
  methods: {
    scale: function(e, item) {
      this.islarge = item;
    }
  },
  created() {
    this.todos.map((item, index) => {});
  }
};
</script>

<style lang="scss">
.table1 {
  display: flex;
  flex-wrap: wrap;
  padding-top: 20px;
}
.table-main {
  width: calc((100vw - 280px) / 2);
  margin-bottom: 20px;
  margin-right: 10px;
  .el-table--mini td,
  .el-table--mini th {
    padding: 2px 0;
  }
}
.high {
  color: #f56c6c;
}
.low {
  color: #e6a23c;
}
</style>