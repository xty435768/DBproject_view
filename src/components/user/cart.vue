<template>
  <div>
    <el-table :data="orderList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55"> </el-table-column>
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="商品名称">
        <template slot-scope="scope">
          <div>
            <router-link
              target="_blank"
              :to="{
                path: '/itemDetail',
                query: {
                  id: scope.row.itemID,
                },
              }"
              
            >
              {{ orderList[scope.$index].item_name }}
            </router-link>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="订单价格"
        prop="order_price"
        sortable
      ></el-table-column>
      <el-table-column label="联系方式">
        <template slot-scope="scope">
          手机：{{scope.row.mobile}}<br/>QQ：{{scope.row.qq}}
        </template>
      </el-table-column>

      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)" >删除</el-button>
          <el-button size="mini" :type="(scope.row.description.length == 0)?'info':'primary'" @click="handleEditDescription(scope.$index, scope.row)" >{{(scope.row.description.length == 0)?'添加':'修改'}}备注</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="margin-top: 20px">
      <span style="margin-right: 20px; display: inline-block"
        >总价：{{ total_price }}元</span
      >
      <el-button
        type="primary"
        size="small"
        @click="submitBtn"
        :disabled="btn > 0 ? false : true"
        >去结算<i class="el-icon-upload el-icon--right"></i
      ></el-button>
    </div>
  </div>
</template>

<script>

import { getCurrentTime } from "../../assets/constants.js";
export default {
  name: "cart",
  data() {
    return {
      // 订单查询对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10,
      },
      // 总数
      total: 0,
      total_price: 0,
      btn: 0,
      // 订单列表
      orderList: [],
      selected: [],
    };
  },

  created() {
    // 获取订单数据列表
    this.getOrderList();
  },
  methods: {
    uploadOrder(index) {
      this.$axios
        .post("/transaction/create", {
          commodityID: this.orderList[index].itemID,
          studentID: window.sessionStorage.getItem("user"),
          time: getCurrentTime(),
          status: "已下单",
          description: this.orderList[index].description,
        })
        .then((resp) => {
          console.log("creating new order");
          console.log(resp);
          if (resp && resp.status === 200) {
            console.log("create success");
          }
        });
    },
    deleteHelper(index) {
      this.$axios
        .post("/student/delete_cart", {
          cartID: this.orderList[index].cartID,
        })
        .then((resp) => {
          console.log("delete cart");
          console.log(resp);
          if (resp && resp.status === 200) {
            console.log("delete success");
          }
        });
    },
    handleEditDescription(index, row){
      this.$prompt('可以在这里写一些备注给卖家看哦', '添加订单备注', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder:'在C12楼下交易可以吗？',
          inputValue: row.description,
          inputValidator: (val) => {
            if (val.length > 50) return '最长输入50个字！你输入了'+val.length+'个字'
          },
        }).then(({value}) => {
          row.description = value;
        }).catch(() => {
          console.log('取消添加备注');
        });
    },
    handleDelete(index, row) {
      this.$confirm("此操作把此商品移除购物出, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "删除成功!",
          });
          this.deleteHelper(index, row);
          this.orderList.splice(index, 1);
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    submitBtn() {
      this.$confirm(
        "共花费" + this.total_price + "元，确定提交订单吗?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          for (var i = 0; i < this.selected.length; ++i) {
            this.uploadOrder(this.selected[i]);
            this.deleteHelper(this.selected[i]);
            this.orderList.splice(this.selected[i], 1);
          }
          this.$message({
            type: "success",
            message: "购买成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    handleSelectionChange(val) {
      this.btn = val.length;
      this.selected = [];
      // console.log(val);
      var price = 0;
      for (var i = 0; i < val.length; i++) {
        price += parseInt(val[i].order_price);
        this.selected.push(val[i].position);
      }
      console.log(this.selected);
      this.total_price = price;
    },
    // 获取订单数据列表
    getOrderList() {
      this.orderList = [];
      this.$axios
        .post("/student/get_cart", {
          studentID: window.sessionStorage.getItem("user"),
        })
        .then((resp) => {
          // console.log("showing cart");
          console.log(resp.data);
          if (resp && resp.status === 200) {
            for (var i = 0; i < resp.data.length; i++) {
              this.orderList.push({
                item_name: resp.data[i].commodity.name,
                order_price: resp.data[i].commodity.price,
                mobile: resp.data[i].commodity.student.mobile,
                cartID: resp.data[i].id,
                itemID: resp.data[i].commodity.id,
                qq: resp.data[i].commodity.student.qq,
                description: '',
                position: i,
              });
            }
          }
        });
    },
  },
};
</script>
