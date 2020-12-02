<template>
    <div width="100%">
        <div style="text-align: left;margin-left:10px;margin-bottom:10px">
            <el-button type="primary" style="margin-left:10px" @click="findByBuyer">按购买者查找订单</el-button>
            <el-button type="primary" style="margin-left:10px" @click="findByCommodity">按商品查找订单</el-button>
            <el-button type="primary" style="margin-left:10px" @click="findAll">获取所有订单</el-button>
        </div>
        <el-table 
        :data="transactions.slice((currentPage-1)*pagesize,currentPage*pagesize)"
        @selection-change='handleCurrentChange'
        style="margin-left:10px">
            <el-table-column prop="id" label="ID" width="100px"></el-table-column>
            <el-table-column prop="commodity_id" label="商品ID" width="100px" sortable></el-table-column>
            <el-table-column prop="commodity_name" label="商品名称">
                <template slot-scope="scope">
                    <div>
                        <router-link
                          target="_blank"
                          :to="{ path: '/itemDetail', query: { id: scope.row.commodity_id}}">
                          {{ transactions[scope.$index].commodity_name }}
                        </router-link>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="commodity_price" label="商品价格" sortable width="120px"></el-table-column>
            <el-table-column label="买方" width="175px">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="showUserInfo(scope.row.buyer_id)">
                    {{scope.row.buyer_id}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="卖方" width="175px">
                <template slot-scope="scope">
                    <el-button size="mini" plain type="primary" @click="showUserInfo(scope.row.seller_id)">
                    {{scope.row.seller_id}}
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column label="订单状态" prop="status" width="100px" icon="el-icon-info">
                <template slot="header" slot-scope="scope">订单状态
                    <el-tooltip class="item" effect="dark" content="点击标签可以查看订单的跟踪信息" placement="top">
                        <i class="el-icon-info"></i>
                    </el-tooltip>
                </template>
                <template slot-scope="scope">
                    <el-tag type="danger" v-if="scope.row.status == '已下单'"  @click="showTransactionStatusDetail(scope.row.id)" style="cursor:pointer;">未发货</el-tag>
                    <el-tag type="primary" v-if="scope.row.status == '已发货'" @click="showTransactionStatusDetail(scope.row.id)" style="cursor:pointer;">已发货</el-tag>
                    <el-tag type="primary" v-if="scope.row.status == '已评价'" @click="showTransactionStatusDetail(scope.row.id)" style="cursor:pointer;">已评价</el-tag>
                    <el-tag type="success" v-if="scope.row.status == '已收货'" @click="showTransactionStatusDetail(scope.row.id)" style="cursor:pointer;">已收货</el-tag>
                </template>
        </el-table-column>
        </el-table>
        <el-pagination
            background
            layout="sizes, prev, pager, next"
            :total="this.transactions.length"
            @current-change = 'handleCurrentChange'
            @size-change = 'handleSizeChange'
            :page-sizes="[5,10,15,20]"
            style="margin-top:30px"
        >
        </el-pagination>
        <el-dialog title="订单状态时间线" :visible.sync="timelineDialogVisible" width="30%">
            <el-form v-if="transactionID > 0" label-width="80px" style="text-align:left">
                <el-form-item label="订单编号">
                    <!-- <el-input disabled v-model="transactionID"></el-input> -->
                    <el-tag>{{transactionID}}</el-tag>
                </el-form-item>
            </el-form>
            <TimeLine :transactionID="transactionID"></TimeLine>
            <span slot="footer" class="dialog-footer">
                <el-button @click="timelineDialogVisible = false;">关 闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="用户详情查看" :visible.sync="userinfoDialogVisible" width="30%">
            <div v-if="failedQuery">
                <h3>不存在该用户！</h3>
                用户id：{{user_id}}
            </div>
            <div v-else>
                <el-form label-width="70px">
                    <el-form-item label="学号" style="margin-bottom:22px">
                        <el-input readonly v-model="user_id"></el-input>
                    </el-form-item>
                    <el-form-item label="学院" style="margin-bottom:22px">
                        <el-input readonly v-model="user_department"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号" style="margin-bottom:22px">
                        <el-input readonly v-model="user_mobile"></el-input>
                    </el-form-item>
                    <el-form-item label="宿舍" style="margin-bottom:22px">
                        <el-input readonly v-model="user_dormitory"></el-input>
                    </el-form-item>
                    <el-form-item label="专业" style="margin-bottom:22px">
                        <el-input readonly v-model="user_major"></el-input>
                    </el-form-item>
                    <el-form-item label="性别" style="margin-bottom:22px">
                        <el-input readonly v-model="user_sex"></el-input>
                    </el-form-item>
                    <el-form-item label="QQ" style="margin-bottom:22px">
                        <el-input readonly v-model="user_qq"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="userinfoDialogVisible = false;">关 闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import TimeLine from '../TransactionTimeLine'
export default {
    components:{
        TimeLine,
    },
    data(){
        return{
            transactions:[],
            timelineDialogVisible:false,
            transactionID:-1,

            userinfoDialogVisible:false,
            failedQuery:true,
            user_id:'null',
            user_department:'',
            user_mobile:'',
            user_dormitory:'',
            user_major:'',
            user_sex:'',
            user_qq:'',

            //pagination
            total:0,  //总条数
            pagesize:10,  //每页的条数
            currentPage:1,  //默认开始页面
        }
    },
    methods:{
        findByBuyer(){
            this.$prompt('请输入购买者学号', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /[0-9]{12}/,
              inputErrorMessage: '学号格式不正确，需为12位数字'
            }).then(({ value }) => {
                this.getData('/student/get_transaction',{studentID:value})
            }).catch(() => {   
            });
        },
        findByCommodity(){
            this.$prompt('请输入商品ID', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              inputPattern: /[0-9]+/,
              inputErrorMessage: '商品ID不正确，需为数字'
            }).then(({ value }) => {
                this.getData('/commodity/get_transaction',{commodityID:value})
            }).catch(() => {   
            });
        },
        findAll(){
            this.getData();
        },
        handleSizeChange(val){
            this.pagesize = val;
        },
        handleCurrentChange(currentPage){
            this.currentPage = currentPage;
        },
        showUserInfo(id){
            this.userinfoDialogVisible = true;
            this.$axios.post('/user_info/get',{userID: id, userType: 'user'}).then(res=>{
                var d = eval(res.data);
                if(d['is_success'] === 'true'){
                    this.failedQuery = false;
                    this.user_id = id;
                    this.user_department = d['college'];
                    this.user_mobile = d['mobile'];
                    this.user_dormitory = d['dormitory'];
                    this.user_major = d['major'];
                    this.user_sex = d['sex'];
                    this.user_qq = d['qq'];
                    console.log(res.data);
                }
                else {
                    this.failedQuery = true;
                }
            }).catch((failResponse) => {
                this.$notify.error({ title: '调取用户信息异常！', message: failResponse.message })
                this.failedQuery = true;
            })
        },
        showTransactionStatusDetail(transaction_id){
            this.timelineDialogVisible = true;
            this.transactionID = transaction_id;
        },
        getData(address = '/transaction/get_all',payload = {}){
            this.transactions.length = 0;
            this.$axios.post(address,payload).then(res=>{
                var data = eval(res.data);
                console.log(address,payload,data)
                if(data){
                    for (let index = 0; index < data.length; index++) {
                        const element = data[index];
                        this.transactions.push({
                            id:element.id,
                            commodity_name:element.commodity.name,
                            commodity_price:element.commodity.price,
                            commodity_id:element.commodity.id,
                            buyer_id:element.student.studentId,
                            seller_id:element.commodity.student.studentId,
                            status:element.currentStatus.status,
    
                        })
                    }
                    this.$message({message:'获取成功！',type:'success',center:true,showClose:true})
                }
            }).catch(failResponse => {
                this.$notify.error({title: '拉取订单异常！',message: failResponse.message});
            })
        }
    },
    mounted(){
        this.getData();
    },
    
}
</script>