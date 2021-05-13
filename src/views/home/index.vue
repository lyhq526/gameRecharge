<template>
  <div class="my-data">
    <div class="filter">
      <div>
        <p style="min-width:140px">缔星账号(手机号)：</p>
        <el-input v-model="filterData.phone" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <p>游戏名称：</p>

        <el-select v-model="filterData.game" placeholder="请选择">
          <el-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </div>
      <div>
        <p style="min-width:70px;">游戏ID：</p>
        <el-input v-model="filterData.gameUserId" placeholder="请输入内容"></el-input>
      </div>
      <div>
        <p>提交时间：</p>

        <el-date-picker
          v-model="createTime"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </div>
      <el-button type="primary" @click="filter">搜索</el-button>
    </div>
    <el-table :data="tableData" style="width: 100%" height="500">
      <el-table-column prop="phone" label="缔星账号"></el-table-column>
      <el-table-column prop="gameUserId" label="游戏ID"></el-table-column>
      <el-table-column prop="game" label="游戏名称"></el-table-column>
      <el-table-column prop="Ingots" label="元宝"></el-table-column>
      <el-table-column prop="status" label="状态">
        <template slot-scope="scope">
          <span>{{scope.row.status=="1"?"待兑换":scope.row.status=="2"?"兑换成功":"兑换失败"}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createTime" label="提交时间">
        <template slot-scope="scope">
          <span>{{dateFormat('YYYY-mm-dd HH:MM:SS',new Date(scope.row.createTime))}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <div class="fontBtn">
            <span style="color:#E7B962;cursor: pointer;" @click="success(scope.row._id)">完成</span>
            <span
              style="color:#E7B962;cursor: pointer;"
              @click="dialogVisible=true;selectData=scope.row"
            >失败</span>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      style="text-align:right;margin-top:20px;"
      :total="page.total"
      @current-change="currentChange"
    ></el-pagination>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="40%">
      失败信息：
      <el-select v-model="errorText" placeholder="请选择">
        <el-option
          v-for="item in errorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="error">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getList, updata } from "../../api/index";
//
export default {
  data() {
    return {
      tableData: [],
      dialogVisible: false,
      selectData: {},
      errorText: "",
      page: {
        page: 1,
        total: 0,
      },
      options: [
        {
          label: "DNF",
          value: "DNF",
        },
      ],
      errorOptions: [
        {
          label: "星火不足",
          value: "星火不足",
        },
      ],
      createTime: [],
      filterData: {
        phone: "",
        game: "",
        gameUserId: "",
      },
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString(), // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(
            ret[1],
            ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0")
          );
        }
      }
      return fmt;
    },
    filter() {
      this.page.page = 1;
      this.getData();
    },
    error() {
      if (!this.errorText) {
        this.$message({
          message: "请先选择失败原因",
          type: "error",
        });
        return;
      }
      updata({ id: this.selectData._id, status: -1,errorText:this.errorText }).then((res) => {
        if (res.code == 200) {
          this.dialogVisible = false;
          this.selectData = {};
          this.errorText = "";
          this.page.page = 1;
          this.getData();
        }
      });
    },
    currentChange(val) {
      this.page.page = val;
      this.getData();
    },
    getData() {
      let pram = {
        ...this.filterData,
        page: this.page.page,
        ...{
          createTimeStart: this.createTime[0],
          createTimeEnd: this.createTime[1],
        },
      };
      getList(pram).then((res) => {
        this.tableData = res.data;
        this.page.total = res.pageCount;
      });
    },
    success(val) {
      updata({ id: val, status: 2 }).then((res) => {
        if (res.code == 200) {
          this.getData();
        } else {
          this.$message({
            message: res.message,
            type: "error",
          });
        }
      });
    },
  },
};
</script>
<style scoped lang="scss">
.my-data {
  .filter {
    display: flex;
    flex-wrap: wrap;
    & > div {
      margin: 10px 20px 10px 0;
      display: flex;
      align-items: center;
    }
  }
  .fontBtn {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>