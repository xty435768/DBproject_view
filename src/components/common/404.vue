<template>
    <div>
        <h1>
            页面走丢了！(404 Error)
        </h1>
        <el-button @click="handleClick">点我返回</el-button>
    </div>
</template>
<script>
export default {
    name:'notFound',
    data(){
        return{

        }
    },
    methods:{
        handleClick(){
            this.$router.go(-1);
        }
    }
}
</script>