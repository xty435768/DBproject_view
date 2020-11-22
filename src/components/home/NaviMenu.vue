<template>
    <div>
        <el-menu
                router
                mode="horizontal"
                background-color="white"
                text-color="#222"
                active-text-color="red"
                style="min-width: 1300px;margin: 8px 8px 0px 8px;">
            <el-menu-item v-for="(item,i) in navList" :key="i" :index="item.name">
                {{ item.navItem }}</el-menu-item>
            <div class="logout"  @click="logout">注销</div>
            <i class="el-icon-menu" style="float:right;font-size: 45px;color: #44cb73;"></i>
            <img src="../../assets/website_header.png" class="imgTitle"   style="height:50px;width:400px; pointer-events: none;"/>
            <!--<span >Youth  - One Piece</span>-->
        </el-menu>
    </div>
</template>
<script>
    export default {
        name: 'NavMenu',
        data () {
            return {
                
                navList: [
                    {name: '/index', navItem: '首页'},
                    
                    {name: '/market', navItem: '校园商城'},
                    {name: '/release', navItem: '发布新商品'},
                    {name: '/user/info', navItem: '个人中心'}
                    //{name; '/user/info',}
                ]
            }
        },
        methods:{
            logout(){
                //删除cookie
                let date = new Date();
                date.setTime(date.getTime()+(0));
                document.cookie="user="+";"+"expires="+date.toUTCString();
                window.sessionStorage.removeItem('user')
                this.$router.replace({path: '/login'});
                this.$message({
                    showClose:true,
                    message:'注销成功',
                    type:'success',
                });
            }
        }
    }
</script>

<style scoped>
    .logout{
        color: #44c068;
        float: right;
        padding: 20px;
        cursor:pointer
    }
    .logout:hover{
        color: #e5e747;
    }
    a{
        text-decoration: none;
    }
    span {
        pointer-events: none;
    }
</style>
