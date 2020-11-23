<template>
  <div>
    <el-row style="height: 840px;margin: 40px 40px auto 40px">
      <el-tooltip effect="dark" placement="right" v-for="item in books.slice((currentPage - 1) * pageSize, currentPage * pageSize)" :key="item.id">
        <p slot="content" style="font-size: 14px;margin-bottom: 6px;">《{{ item.name }}》</p>
        <p slot="content" style="font-size: 13px;margin-bottom: 6px">
          <span>{{ item.price }}元</span>
        </p>

        <el-card style="width: 135px;margin-bottom: 20px;height: 233px;float: left;margin-right: 15px" class="book" bodyStyle="padding:10px" shadow="hover">
          <router-link
            target="_blank"
            :to="{
              path: '/itemDetail',
              query: {
                id: item.id,
              },
            }"
            class="cover"
            @click.native="sendBookMsg(item)"
          >
            <img :src="item.cover.dir" alt="封面" />
          </router-link>
          <div class="info">
            <div class="title">
              <a href="">{{ item.title }}</a>
            </div>
            <i class="el-icon-delete" @click="deleteBook(item.id, item.uid, item.cover, item.img_1, item.img_2, item.img_3, item.img_4, item.img_5)"></i>
          </div>
          <div class="author" style="color: #ee231e;">{{ item.price }}元</div>
        </el-card>
      </el-tooltip>
      <input type="button" value="select" v-on:click="loadBooks" />
    </el-row>
    <el-row>
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="books.length"> </el-pagination>
    </el-row>
  </div>
</template>
<script>
export default {
  name: 'Books',
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 18,
      BookMsg: 'BookMsg',
      temp_data:
        '[\
                {"id":39,"cover":"http://125.216.249.215:45678/api/file/090AZUHxmR.jpg","title":"阿斯蒂芬","author":"阿斯蒂芬","date":"2020","price":"666","newOld":"八成新","contact":"222","phone":"222","qq":"222","weChat":"333","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"333","cid":"4","uid":"admin"}, \
                {"id":40,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin"}, \
                {"id":41,"cover":"http://125.216.249.215:45678/api/file/qSeyr2PXz1.jpg","title":"就跑了","author":"young","date":"2010","price":"123","newOld":"九成新","contact":"杨鸿申","phone":"15007580941","qq":"21452346","weChat":"6456412","img_1":"","img_2":"","img_3":"","img_4":"","img_5":"","abs":"213123","cid":"4","uid":"admin1"}, \
                ]',
    }
  },
  //挂载数据后执行
  mounted() {
    this.loadBooks()
    this.$bus.on('changeCurrentPage', (val) => {
      this.currentPage = val
    })
  },
  destroyed() {
    this.$bus.off('changeCurrentPage')
  },

  methods: {
    loadBooks() {
      console.log('loading books-------------')
      console.log(this)
      //this.books = eval(this.temp_data)

      this.$axios
        .post('/student/get_release', {
          studentID: window.sessionStorage.getItem('user'),
        })
        .then((resp) => {
          console.log('logging resp')
          console.log(resp)
          if (resp && resp.status === 200) {
            this.books = resp.data
          }
        })
    },
    handleCurrentChange(currentPage) {
      this.currentPage = currentPage
    },
    searchResult() {
      this.$axios({
        method: 'post',
        url: '/search',
        params: {
          keywords: this.$refs.searchBar.keywords,
        },
      }).then((resp) => {
        if (resp && resp.status === 200) {
          this.books = resp.data
        }
      })
    },
    deleteBook(id) {
      //commodity/delete  commodityID
      console.log('deleting books')
      this.$confirm('此操作将永久删除该书籍, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          this.$axios
            .post('/commodity/delete', {
              commodityID: id,
            })
            .then((resp) => {
              console.log(resp)
              if (resp && resp.status === 200) {
                if (resp.statusText === 'OK') {
                  this.$message({
                    showClose: true,
                    type: 'success',
                    message: '删除成功',
                  })
                  this.loadBooks()
                } else {
                  this.$message({
                    showClose: true,
                    type: 'waring',
                    message: '删除失败，该图书已被删除',
                  })
                  this.loadBooks()
                }
              }
            })
        })
        .catch(() => {
          this.$message({
            showClose: true,
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    sendBookMsg(item) {
      this.$bus.emit('bookMsg', item.title)
    },
  },
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

a:link,
a:visited,
a:focus {
  color: #3377aa;
}
</style>
