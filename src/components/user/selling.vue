<template>
  <div>
    <div width="100%">
      <el-table :data="soldBooks" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="45"> </el-table-column> -->
        <el-table-column prop="transactionID" label="ID" width="70px"></el-table-column>
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
        <el-table-column label="订单价格" prop="order_price" sortable width="120px"></el-table-column>
        <el-table-column label="买家">
          
          <template slot-scope="scope">
            <el-tooltip placement="right" content="Top Left 提示文字">
              <p slot="content" style="font-size: 14px;">昵称：{{ soldBooks[scope.$index].buyer_name }}</p>
              <p slot="content" style="font-size: 14px;">电话: {{ soldBooks[scope.$index].buyer_mobile }}</p>
              <p slot="content" style="font-size: 14px;">QQ: {{ soldBooks[scope.$index].buyer_qq }}</p>
              <div>{{ soldBooks[scope.$index].buyer_name }}</div>
            </el-tooltip>
          </template>
          
        </el-table-column>
        <el-table-column prop="order_time" label="发布时间" sortable></el-table-column>
        <el-table-column label="货物状态" prop="if_get_book" width="100px">
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
          if (eval(resp.data)['is_success']=='true') {
            this.orderList[index].if_get_book = '已收货'
          } else {
            this.$notify.error({title: '状态更新失败',message: eval(resp.data)['description']})
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
                .then(response => {
                  var trans_data = eval(response.data)
                  for (let i = 0; i < trans_data.length; i++) {
                    this.soldBooks.push({
                        bookID: trans_data[i].commodity.id,
                        bookName: trans_data[i].commodity.name,
                        order_price: trans_data[i].commodity.price,
                        order_time: trans_data[i].currentStatus.time,
                        buyer_name: trans_data[i].student.name,
                        buyer_mobile: trans_data[i].student.mobile,
                        buyer_qq: trans_data[i].student.qq,
                        if_get_book: trans_data[i].currentStatus.status,
                        transactionID: trans_data[i].id,
                      })
                  }
                })
            }
          }
        }).catch(failResponse => {
            this.$notify.error({title: '获取售出订单失败',message: failResponse.data})
      });
    },
  },

  mounted() {
    this.getSoldItems()
  },
}
</script>
