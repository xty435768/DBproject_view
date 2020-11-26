<template>
  <div>
    <div width="100%">
      <el-table :data="orderList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="45"> </el-table-column> -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称">
        <template slot-scope="scope">
          <div>
            <router-link
              target="_blank"
              :to="{
                path: '/itemDetail',
                query: {
                  id: scope.row.bookID,
                },
              }"
              
            >
              {{ orderList[scope.$index].bookName }}
            </router-link>
          </div>
        </template>
      </el-table-column>
        <el-table-column
          label="订单价格"
          prop="order_price"
          sortable
        ></el-table-column>
        <el-table-column
          prop="order_time"
          label="发布时间"
          sortable
        ></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="是否收到" prop="if_get_book">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.if_get_book == '已下单'"
              >未收到</el-tag
            >
            <el-tag type="success" v-else>已收货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >

            <el-button
              v-if="scope.row.if_get_book == '已下单'"
              size="mini"
              type="success"
              @click="handleSuccess(scope.$index, scope.row)"
              >确认到货</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCurrentTime } from "../../assets/constants.js";

export default {
  data() {
    return {
      orderList: [
        {
          bookName: "哈哈哈",
          order_price: 12,
          order_time: "2020-07-08",
          if_get_book: 1,
          mobile: "125347568",
        },
        {
          bookName: "哈哈哈",
          order_price: 12,
          order_time: "2020-07-08",
          if_get_book: 0,
          mobile: "125347568",
        },
        {
          bookName: "哈哈哈",
          order_price: 12,
          order_time: "2020-07-08",
          if_get_book: 1,
          mobile: "125347568",
        },
      ],
    };
  },
  methods: {
    handleSuccess(index, row) {
      this.orderList[index].if_get_book = "已收货";
      this.$axios
        .post("/transaction/update_status", {
          transactionID: this.orderList[index].transactionID,
          time: getCurrentTime(),
          status: "已收货",
          description: "",
        })
        .then((resp) => {
          console.log("showing orders");
          console.log(resp.data);
          if (resp && resp.status === 200) {
          }
          else{
            console.log("err");
          }
        });
    },
    handleDelete(index, row) {},
    getOrderList() {
      this.orderList = [];
      this.$axios
        .post("/student/get_transaction", {
          studentID: window.sessionStorage.getItem("user"),
        })
        .then((resp) => {
          console.log("showing orders");
          console.log(resp.data);
          if (resp && resp.status === 200) {
            for (var i = 0; i < resp.data.length; i++) {
              this.orderList.push({
                bookName: resp.data[i].commodity.name,
                order_price: resp.data[i].commodity.price,
                order_time: resp.data[i].currentStatus.time,
                if_get_book: resp.data[i].currentStatus.status,
                mobile: resp.data[i].commodity.student.mobile,
                transactionID: resp.data[i].id,
                bookID: resp.data[i].commodity.id,
              });
            }
          }
        });
    },
    handleSelectionChange(val) {},
  },
  created() {
    this.getOrderList();
  },
};
</script>