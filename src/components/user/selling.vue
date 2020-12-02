<template>
  <div>
    <div width="100%">
      <el-table :data="soldItems" @selection-change="handleSelectionChange">
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
                    id: scope.row.itemID,
                  },
                }"
              >
                {{ soldItems[scope.$index].itemName }}
              </router-link>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="订单价格" prop="order_price" sortable width="120px"></el-table-column>
        <el-table-column label="买家">
          
          <template slot-scope="scope">
            <el-tooltip placement="right" content="Top Left 提示文字">
              <p slot="content" style="font-size: 14px;">昵称：{{ soldItems[scope.$index].buyer_name }}</p>
              <p slot="content" style="font-size: 14px;">电话: {{ soldItems[scope.$index].buyer_mobile }}</p>
              <p slot="content" style="font-size: 14px;">QQ: {{ soldItems[scope.$index].buyer_qq }}</p>
              <div>{{ soldItems[scope.$index].buyer_name }}</div>
            </el-tooltip>
          </template>
          
        </el-table-column>
        <el-table-column prop="order_time" label="发布时间" sortable></el-table-column>
        <el-table-column label="订单状态" prop="if_get_item" width="100px">
          <template slot="header" slot-scope="scope">订单状态
            <el-tooltip class="item" effect="dark" content="点击标签可以查看订单的跟踪信息" placement="top">
              <i class="el-icon-info"></i>
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <el-tag type="danger"  v-if="scope.row.if_get_item == '已下单'" @click="showTransactionStatusDetail(scope.row.transactionID)" style="cursor:pointer;">未发货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_item == '已发货'" @click="showTransactionStatusDetail(scope.row.transactionID)" style="cursor:pointer;">已发货</el-tag>
            <el-tag type="success" v-if="scope.row.if_get_item == '已收货'" @click="showTransactionStatusDetail(scope.row.transactionID)" style="cursor:pointer;">已收货</el-tag>
            <el-tag type="primary" v-if="scope.row.if_get_item == '已评价'" @click="showTransactionStatusDetail(scope.row.transactionID)" style="cursor:pointer;">已评价</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <!-- <el-button size="mini" v-if="scope.row.if_get_item == '已收货'" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
            <el-button size="mini" v-if="scope.row.if_get_item != '已收货'" disabled type="danger">删除</el-button> -->

            <el-button size="mini" v-if="scope.row.if_get_item == '已下单'" type="success" @click="handleSend(scope.$index, scope.row)">发货</el-button>
            <el-button size="mini" v-if="scope.row.if_get_item == '已发货'" disabled type="success">发货</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog title="订单状态时间线" :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <TimeLine :transactionID="transactionID"></TimeLine>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false;">关 闭</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getCurrentTime } from '../../assets/constants.js'
import TimeLine from '../TransactionTimeLine'
export default {
  components:{TimeLine},
  data() {
    return {
      soldItems: [],
      dialogVisible: false,
      transactionID:-1,
    }
  },
  methods: {
    showTransactionStatusDetail(transaction_id){
      this.dialogVisible = true;
      this.transactionID = transaction_id;
    },
    handleDelete(index, row) {
      this.$confirm('删除了买家也看不到了(ಥ _ ಥ)确定要删除吗？', '提示', {
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
          this.soldItems.splice(index, 1)
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    handleSend(index, row) {
      if(this.soldItems[index].if_get_item == '已发货'){
        this.$message({
          type: 'error',
          message: '不能重复发货！请刷新页面后重试！',
        })
        return
      }
      this.$prompt('确认发货吗？','发货确认',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPlaceholder:'可以在这里写一些备注...',
        inputValidator: (val) => {
          if (val.length > 50) return '最长输入50个字！你输入了'+val.length+'个字'
        },
      }).then(({value}) => {
          this.$axios.post('/transaction/update_status', {
            transactionID: this.soldItems[index].transactionID,
            time: getCurrentTime(),
            status: '已发货',
            description: value,
          })
          .then((resp) => {
            //console.log('showing orders')
            //console.log(resp.data)
            if (eval(resp.data)['is_success']=='true') {
              this.soldItems[index].if_get_item = '已发货'
            } else {
              this.$notify.error({title: '状态更新失败',message: eval(resp.data)['description']})
            }
          }).catch(failResponse => {
              this.$notify.error({title: '状态更新异常！',message: failResponse.message});
          })
      })
    },

    getSoldItems() {
      this.soldItems = []
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
                    this.soldItems.push({
                        itemID: trans_data[i].commodity.id,
                        itemName: trans_data[i].commodity.name,
                        order_price: trans_data[i].commodity.price,
                        order_time: trans_data[i].currentStatus.time,
                        buyer_name: trans_data[i].student.name,
                        buyer_mobile: trans_data[i].student.mobile,
                        buyer_qq: trans_data[i].student.qq,
                        if_get_item: trans_data[i].currentStatus.status,
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
