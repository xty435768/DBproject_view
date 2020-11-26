<template>
  <div>
    <div width="100%">
      <el-table :data="soldBooks" @selection-change="handleSelectionChange">
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
                {{ soldBooks[scope.$index].bookName }}
              </router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price" sortable></el-table-column>
        <el-table-column label="买家">
          <template slot-scope="scope">
            <div>姓名: {{ soldBooks[scope.$index].buyer_name }}</div>
            <div>电话: {{ soldBooks[scope.$index].buyer_mobile }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="order_time" label="发布时间" sortable></el-table-column>
        <el-table-column label="货物状态" prop="if_get_book">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.if_get_book == '已下单'">未发货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_book == '已发货'">已发货</el-tag>
            <el-tag type="success" v-if="scope.row.if_get_book == '已收货'">已收货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" v-if="scope.row.if_get_book == '已收货'" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" v-if="scope.row.if_get_book != '已收货'" disabled type="danger">删除</el-button>

            <el-button size="mini" v-if="scope.row.if_get_book == '已下单'" type="success" @click="handleSend(scope.$index, scope.row)">发货</el-button>
            <el-button size="mini" v-if="scope.row.if_get_book == '已发货'" disabled type="success">发货</el-button>
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
      soldBooks: [],
    }
  },
  methods: {
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
          this.soldBooks.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleSend(index, row) {
      this.soldBooks[index].if_get_book = '已发货'
      this.$axios
        .post('/transaction/update_status', {
          transactionID: this.soldBooks[index].transactionID,
          time: getCurrentTime(),
          status: '已发货',
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

    getSoldItems() {
      this.soldBooks = []
      this.$axios
        .post('/student/get_release', {
          studentID: window.sessionStorage.getItem('user'),
        })
        .then((resp) => {
          //console.log(resp.data)
          if (resp && resp.status === 200) {
            for (var i = 0; i < resp.data.length; ++i) {
              //console.log(resp.data[i].id)
              this.$axios
                .post('/commodity/get_transaction', {
                  commodityID: resp.data[i].id,
                })
                .then((resp) => {
                  // console.log(resp)
                  if (resp && resp.status === 200) {
                    if (resp.data.length > 3) {
                      //console.log(resp.data.length)
                      var trans_data = eval(resp.data)
                      console.log(trans_data[0])
                      this.soldBooks.push({
                        bookName: trans_data[0].commodity.name,
                        order_price: trans_data[0].commodity.price,
                        order_time: trans_data[0].currentStatus.time,
                        buyer_name: trans_data[0].student.name,
                        buyer_mobile: trans_data[0].student.mobile,
                        if_get_book: trans_data[0].currentStatus.status,
                        transactionID: trans_data[0].id,
                      })
                    }
                  }
                })
            }
          }
        })
    },
  },

  mounted() {
    this.getSoldItems()
  },
}
</script>
