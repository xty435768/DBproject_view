
<template>
  <div>
    <!-- <h1>button</h1>
    <el-button type="primary" size="mini">主要按钮</el-button>
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb> -->
    <!-- 卡片视图区域
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
      </el-row>
    </el-card> -->

    <!-- 订单列表数据 -->
    <el-table :data="orderList" >
      <el-table-column type="index" label="#"></el-table-column>
      <el-table-column label="订单编号" prop="order_number"></el-table-column>
      <el-table-column label="订单价格" prop="order_price"></el-table-column>
      <el-table-column label="是否付款" prop="pay_status">
        <template slot-scope="scope">
          <el-tag type="success" v-if="scope.row.pay_status == 1"
            >已付款</el-tag
          >
          <el-tag type="danger" v-else>未付款</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="是否发货" prop="is_send"></el-table-column>
      <!-- <el-table-column label="下单时间" prop="create_time">
        <template slot-scope="scope">
          {{ (scope.row.create_time * 1000) | dateFormat }}
        </template>
      </el-table-column> -->
      <el-table-column label="操作">
        <template slot-scope="scope">
        <el-button
          size="mini"
          type="danger"
          @click="handleDelete(scope.$index, scope.row)">删除</el-button>
      </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: "Order",
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
      // 订单列表
      orderList: [
        {
          order_number: "1231241",
          order_price: "50",
          pay_status: 1,
          is_send: "否",
        },
        {
          order_number: "1231241",
          order_price: "50",
          pay_status: 0,
          is_send: "否",
        },
      ],
    };
  },

  created() {
    // 获取订单数据列表
    this.getOrderList();
  },
  methods: {
    // 获取订单数据列表
    async getOrderList() {
      // const {data:res} = await this.$http.get('orders', {params: this.queryInfo})
      // if(res.meta.status !== 200) return this.$message.error('获取订单列表失败！')
      // console.log(res.data)
      // this.orderList = res.data.goods
      // this.total = res.data.total
    },
  },
};
</script>
