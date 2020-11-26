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
        <el-table-column label="订单价格" prop="order_price" sortable></el-table-column>
        <el-table-column prop="order_time" label="下单时间" sortable></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="是否收到" prop="if_get_book">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.if_get_book == '已下单'">未发货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_book == '已发货'">已发货</el-tag>
            <el-tag type="success" v-if="scope.row.if_get_book == '已收货'">已收货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.if_get_book != '已收货'" size="mini" type="danger" disabled @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button v-if="scope.row.if_get_book == '已收货'" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>

            <el-button v-if="scope.row.if_get_book == '已发货'" size="mini" type="success" @click="handleSuccess(scope.$index, scope.row)">确认到货</el-button>
            <el-button v-if="scope.row.if_get_book == '已下单'" size="mini" type="success" disabled>确认到货</el-button>

            <el-button v-if="scope.row.if_get_book == '已收货'" size="mini" type="primary" @click="addComment(scope.$index, scope.row)">添加评论</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCurrentTime } from '../../assets/constants.js'

export default {
  data() {
    return {
      orderList: [],
    }
  },
  methods: {
    check_input() {
      return 'error'
    },
    addComment(index, row) {
      this.$prompt('年轻人，请输入你的评论', '来评', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputValidator: (val) => {
          if (val.length < 3 || val.length > 200) return '最少输入3个字，最长输入200个字！'
        },
      })
        .then(({ value }) => {
          console.log('adding comment')
          console.log(this.orderList[index].commodityID)
          this.$axios
            .post('/student/add_comment', {
              studentID: window.sessionStorage.getItem('user'),
              commodityID: this.orderList[index].commodityID,
              content: value,
              time: getCurrentTime(),
            })
            .then((resp) => {
              console.log(resp)
              if (resp && resp.status === 200) {
                console.log('add comment success')
              }
            })
          this.$message({
            type: 'success',
            message: '评论提交成功' + value,
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          })
        })
    },
    handleSuccess(index, row) {
      this.orderList[index].if_get_book = '已收货'
      this.$axios
        .post('/transaction/update_status', {
          transactionID: this.orderList[index].transactionID,
          time: getCurrentTime(),
          status: '已收货',
          description: '',
        })
        .then((resp) => {
          console.log('showing orders')
          console.log(resp.data)
          if (resp && resp.status === 200) {
          } else {
            console.log('err')
          }
        })
    },
    handleDelete(index, row) {
      this.$confirm('确定要删除订单吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$message({
            type: 'success',
            message: '删除成功!',
          })
          //this.deleteHelper(index, row)
          this.orderList.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    getOrderList() {
      this.orderList = []
      this.$axios
        .post('/student/get_transaction', {
          studentID: window.sessionStorage.getItem('user'),
        })
        .then((resp) => {
          console.log('showing orders')
          console.log(resp.data)
          if (resp && resp.status === 200) {
            for (var i = 0; i < resp.data.length; i++) {
              this.orderList.push({
                commodityID: resp.data[i].commodity.id,
                bookName: resp.data[i].commodity.name,
                order_price: resp.data[i].commodity.price,
                order_time: resp.data[i].currentStatus.time,
                if_get_book: resp.data[i].currentStatus.status,
                mobile: resp.data[i].commodity.student.mobile,
                transactionID: resp.data[i].id,
                bookID: resp.data[i].commodity.id,
              })
            }
          }
        })
    },
    handleSelectionChange(val) {},
  },
  created() {
    this.getOrderList()
  },
}
</script>
