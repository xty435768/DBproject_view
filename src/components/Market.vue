<template>
  <!-- <el-container style="text-align:center;"> -->
    <div >
        <el-row style="height: 550px;margin: 40px 40px auto 40px">
            <!-- <search-bar @onSearch="searchResult" ref="searchBar"></search-bar> -->
            <el-tooltip effect="dark" placement="right"
                        v-for="item in books.slice((currentPage-1)*pageSize,currentPage*pageSize)"
                        :key="item.id">
                <p slot="content" style="font-size: 14px;margin-bottom: 6px;">《{{item.title}}》</p>
                <p slot="content" style="font-size: 13px;margin-bottom: 6px">
                    <span>{{item.author}}</span> /
                    <span>{{item.date}}</span> /
                    <span>{{item.price}}元</span>
                </p>

                <el-card style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px" class="book"
                         bodyStyle="padding:10px" shadow="hover">
                    <router-link target="_blank" :to="{
                    path:'/itemDetail',
                    query:{
                    title:item.title,
                    cover:item.cover,
                    price:item.price,
                    author:item.author,
                    date:item.date,
                    newOld:item.newOld,
                    contact:item.contact,
                    phone:item.phone,
                    qq:item.qq,
                    weChat:item.weChat,
                    abs:item.abs,
                    img_1:item.img_1,
                    img_2:item.img_2,
                    img_3:item.img_3,
                    img_4:item.img_4,
                    img_5:item.img_5,
                    }}" class="cover" @click.native="sendBookMsg(item)">
                    <!-- <router-link to="/itemDetail"> -->
                        <img :src="item.cover" alt="封面">
                    </router-link>
                    <div class="info" style="text-align: left;">
                        <div class="title">
                            <a :href="'/#/ItemDetail?title='+item.title">{{item.title}}</a> 
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
                temp_data: '[ \
                    {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/JfoUyIVGsJ.jpg","title":"啊手动阀手动阀手动阀","author":"啊手动阀手动阀手动阀","date":"2021","price":"444","newOld":"八成新","contact":"哈哈哈","phone":"222","qq":"333","weChat":"444","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"555","cid":"4","uid":"-5"}, \
                ]'
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
                this.books = eval(this.temp_data)
                // this.$axios.get('/books')
                //     .then(resp => {
                //     if (resp && resp.status === 200) {
                //         this.books = resp.data
                //     }
                // })
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
            deleteBook (id) {
                this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                        this.$axios
                            .post('/delete', {
                                id: id
                            }).then(resp => {
                            if (resp && resp.status === 200) {
                                if(resp.data.code===200){
                                    this.$message({
                                        showClose:true,
                                        type: 'success',
                                        message: '删除成功'
                                    });
                                    this.loadBooks()
                                }else{
                                    this.$message({
                                        showClose:true,
                                        type:'waring',
                                        message:'删除失败，该图书已被删除'
                                    });
                                    this.loadBooks()
                                }
                            }
                        })
                    }
                ).catch(() => {
                    this.$message({
                        showClose:true,
                        type: 'info',
                        message: '已取消删除'
                    })
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