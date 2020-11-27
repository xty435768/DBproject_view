<template>
  <div>
    <div width="100%">
      <el-table :data="orderList" @selection-change="handleSelectionChange">
        <!-- <el-table-column type="selection" width="45"> </el-table-column> -->
        <el-table-column prop="id" label="ID" width="70px"></el-table-column>
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
        <el-table-column label="订单价格" prop="order_price" sortable width="120px"></el-table-column>
        <el-table-column prop="order_time" label="下单时间" sortable></el-table-column>
        <el-table-column label="联系方式" prop="mobile"></el-table-column>
        <el-table-column label="是否收到" prop="if_get_book" width="100px">
          <template slot-scope="scope">
            <el-tag type="danger" v-if="scope.row.if_get_book == '已下单'">未发货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_book == '已发货'">已发货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_book == '已评价'">已评价</el-tag>
            <el-tag type="success" v-if="scope.row.if_get_book == '已收货'">已收货</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="danger" :disabled="!(scope.row.if_get_book in {'已收货':'','已评价':''})" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <!-- <el-button v-if="scope.row.if_get_book == '已收货'" size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button> -->

            <el-button v-if="scope.row.if_get_book == '已发货'" size="mini" type="success" @click="handleSuccess(scope.$index, scope.row)">确认到货</el-button>
            <el-button v-if="scope.row.if_get_book == '已下单'" size="mini" type="success" disabled>确认到货</el-button>

            <el-button v-if="scope.row.if_get_book == '已收货'" size="mini" type="primary" @click="addComment(scope.$index, scope.row)">添加评论</el-button>
            <!-- <el-button v-if="scope.row.if_get_book == '已评价'" size="mini" type="primary" disabled>已评论</el-button> -->
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
      console.log('hello',row)
      this.$prompt('年轻人，请输入你的评论', '来评', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputType:'textarea',
        inputValidator: (val) => {
          if (val.length < 3 || val.length > 200) return '最少输入3个字，最长输入200个字！你输入了'+val.length+'个字'
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
              if (eval(resp.data)['is_success'] === 'true') {
                this.$axios
                  .post('/transaction/update_status', {
                    transactionID: this.orderList[index].transactionID,
                    time: getCurrentTime(),
                    status: '已评价',
                    description: '',
                  })
                  .then((resp) => {
                    if (eval(resp.data)['is_success']=='true') {
                      this.orderList[index].if_get_book = '已评价'
                      this.$message({ type: 'success', message: '评论提交成功',})
                    } else {
                      this.$notify.error({title: '状态更新失败',message: eval(resp.data)['description']})
                    }
                  })
              }else{
                  this.$notify.error({title: '添加评论失败',message: '可能是评论中含有emoji表情等非法字符，请检查后重试。详细信息：\n'+eval(resp.data)['description']})
              }
            }).catch(failResponse => {
            this.$notify.error({title: '添加评论异常',message: failResponse.message});})
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入',
          })
        })
    },
    handleSuccess(index, row) {
      if(this.orderList[index].if_get_book == '已收货'){
        this.$message({
          type: 'error',
          message: '不能重复收货！请刷新页面后重试！',
        })
      }
      this.$confirm('确认收到宝贝了吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          //this.orderList[index].if_get_book = '已收货'
          this.$axios
            .post('/transaction/update_status', {
              transactionID: this.orderList[index].transactionID,
              time: getCurrentTime(),
              status: '已收货',
              description: '',
            })
            .then((resp) => {
              if (eval(resp.data)['is_success']=='true') {
                this.orderList[index].if_get_book = '已收货'
              } else {
                this.$notify.error({title: '状态更新失败',message: eval(resp.data)['description']})
              }
            })
            //更新transaction status
            //this.getOrderList();
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消确认收货'
          });          
        });
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
                id: resp.data[i].id,
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
