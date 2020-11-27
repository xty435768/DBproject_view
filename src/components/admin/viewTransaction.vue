<template>
    <div width="100%">
        <el-table :data="transactions" style="margin-left:10px">
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
            <el-table-column prop="commodity_price" label="商品价格"></el-table-column>
        </el-table>
    </div>
</template>
<script>
export default {
    data(){
        return{
            transactions:[],
        }
    },
    methods:{

    },
    mounted(){
        this.transactions.length = 0;
        this.$axios.post('/transaction/get_all',{}).then(res=>{
            var data = eval(res.data);
            console.log(data)
            if(data){
                for (let index = 0; index < data.length; index++) {
                    const element = data[index];
                    this.transactions.push({
                        commodity_name:element.commodity.name,
                        commodity_price:element.commodity.price,
                        commodity_id:element.commodity.id,

                    })
                }
            }
        }).catch(failResponse => {
            this.$notify.error({title: '拉取订单异常！',message: failResponse.message});
        })
    }
}
</script>