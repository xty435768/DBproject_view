<template>
  <!-- <el-container style="text-align:center;"> -->
    <div >
        <el-row style="height: 550px;margin: 40px 40px auto 40px">
            <!-- <search-bar @onSearch="searchResult" ref="searchBar"></search-bar> -->
            <el-tooltip effect="dark" placement="right"
                        v-for="item in books.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        :key="item.id">
                <p slot="content" style="font-size: 14px;margin-bottom: 6px;">{{item.name}}</p>
                <p slot="content" style="font-size: 13px;margin-bottom: 6px">
                    <!-- <span>{{item.author}}</span> / -->
                    <span>{{item.name}}</span> /
                    <span>{{item.price}}元</span>
                </p>

                <el-card style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px" class="book"
                         bodyStyle="padding:10px" shadow="hover">
                    <router-link target="_blank" :to="{
                    path:'/itemDetail',
                    query:{id:item.id}}" class="cover" @click.native="sendBookMsg(item)">
                    <!-- <router-link to="/itemDetail"> -->
                        <img :src="item.cover.dir" alt="封面">
                    </router-link>
                    <div class="info" style="text-align: left;">
                        <div class="title">
                            <a :href="'/#/ItemDetail?id='+item.id">{{item.name.length>8?item.name.substr(0,7)+"…":item.name}}</a> 
                        </div>
                        <!-- <el-button type="text" style="height:30px;">{{item.title}}</el-button> -->
                    </div>
                    <div class="author" style="color: #ee231e;">{{item.price}}元 </div>
                </el-card>
            </el-tooltip>
        </el-row>
        <el-row>
            <el-pagination
                    @current-change="handleCurrentChange"
                    :current-page="currentPage"
                    :page-size="pageSize"
                    :total="books.length">
            </el-pagination>
        </el-row>
    </div>
  <!-- </el-container> -->
</template>

<script>
    //import SearchBar from './SearchBar'
    //引入公共组件Bus，方便组件之间传递信息
    export default {
        name: 'Books',
        // components: {
        //     SearchBar
        // },
        data () {
            return {
                books: [],
                currentPage: 1,
                pageSize: 18,
                BookMsg:'BookMsg',
            }
        },
        //挂载数据后执行
        mounted(){
            this.loadBooks();
            this.$bus.on("changeCurrentPage",(val)=>{
                this.currentPage=val;
            });
        },
        destroyed() {
            this.$bus.off("changeCurrentPage");
        },

        methods: {
            loadBooks () {
                this.$axios.post('/commodity/get_all',{})
                    .then(resp => {
                    if (resp && resp.status === 200) {
                        this.books = resp.data
                        console.log(resp.data)
                    }
                }).catch(failResponse => {
                    this.$notify.error({title: '拉去商品信息失败',message: failResponse.data});
                })
            },
            handleCurrentChange(currentPage) {
                this.currentPage = currentPage;
            },
            searchResult () {
                this.$axios({
                    method:'post',
                    url:'/search',
                    params:{
                        keywords:this.$refs.searchBar.keywords
                    }
                    }).then(resp => {
                    if (resp && resp.status === 200) {
                        this.books = resp.data
                    }
                })
            },
            sendBookMsg(item){
                this.$bus.emit("bookMsg",item.title);
            }
        }
    }
</script>
<style scoped>
    .cover {
        width: 115px;
        height: 172px;
        margin-bottom: 7px;
        overflow: hidden;
        cursor: pointer;
    }

    img {
        width: 115px;
        height: 172px;
        /*margin: 0 auto;*/
    }

    .title {
        font-size: 14px;
        text-align: left;
    }

    .author {
        color: #333;
        width: 102px;
        font-size: 13px;
        margin-bottom: 6px;
        text-align: left;
    }

    .abstract {
        display: block;
        line-height: 17px;
    }

    .el-icon-delete {
        cursor: pointer;
        float: right;
    }

    .switch {
        display: flex;
        position: absolute;
        left: 780px;
        top: 25px;
    }

    a {
        text-decoration: none;
    }

    a:link, a:visited, a:focus {
        color: #3377aa;
    }

</style>