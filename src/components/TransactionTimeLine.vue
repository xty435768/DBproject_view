<template>
    <div>
        <div v-if="failedQuery">
            <h3>不存在该订单或该订单无状态跟踪信息</h3>
            订单id：{{transactionID}}
        </div>
        <!-- {{transactionID}} -->
        <div v-else style="text-align:left">
            <el-timeline>
                <el-timeline-item v-for="(activity, index) in activities" :key="index" :timestamp="activity.timestamp" placement="top">
                    <h4 style="margin-block-start:0.5em;margin-block-end:0.5em">{{activity.content}}</h4>
                    <p style="margin-block-start:0em;margin-block-end:0em">{{(activity.description == '')?'':'备注：' + activity.description}}</p>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>
<script>
export default {
    name:'TimeLine',
    props:{
        transactionID:{ type: Number, default:-1},
    },
    data(){
        return{
            failedQuery: false,
            activities: []

        }
    },
    mounted(){
        this.getStatus();
    },
    methods:{
        getStatus(){
            this.activities.length = 0;
            this.$axios.post('/transaction/get',{transactionId:this.transactionID}).then(res=>{
            if(res.data == null) {this.failedQuery = true; return;}
            for (let index = 0; index < res.data.transactionStatuses.length; index++) {
                const element = res.data.transactionStatuses[index];
                this.activities.push({
                    content:element.status,
                    timestamp:element.time,
                    description:element.description,
                })
            }
            this.transactionID = -1;
            }).catch(failResponse => {
                this.$notify.error({title: '获取订单跟踪状态失败',message: failResponse.message});
                this.failedQuery = true;
            }) 
        }
    },
    watch:{
        transactionID(){
            if(this.transactionID <= 0) return;
            this.getStatus();
        }
    }
}
</script>