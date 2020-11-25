<template>
  <el-container>
    <el-header height="60px">
      <router-link class="spanTitle" to="/index" target="_blank">
        South China University of Technology Commercial Platform
      </router-link>
    </el-header>
    <el-main class="el-main">
      <div style=" margin-top: 30px;">
        <div style="margin-left: 200px; float: left;">
          <div class="col-left" @click="handleEnlarge(bookMsg.cover)">
            <img :src="bookMsg.cover" class="img-title" style="width: 300px;" />
          </div>
        </div>
        <div class="col-main">
          <div class="div-msg" style="width:300px">
            商品名：<span style="color: #d6524a;">{{ bookMsg.name }}</span>
          </div>
          <div class="div-msg" style="width:300px">
            价格：<span style="color: #ff4400;font-size:26px">{{ bookMsg.price }}</span>
          </div>
          <div class="div-msg" style="width:300px">发布者：{{ bookMsg.stuName }}</div>
          <div class="div-msg" style="width:300px">联系方式（QQ号）：{{ bookMsg.qq }}</div>

          <div class=" div-msg">
            <el-button type="primary" style="width: 150px;height: 50px;" @click="addToCart">添加到购物车</el-button>
          </div>
        </div>
      </div>
    </el-main>
    <div class="center">
      <div class="msgTitle">
        详情描述
      </div>
      <div class="abs" v-html="bookMsg.abs"></div>
      <div class="msgTitle">
        详细图片
      </div>

      <div id="box">
        <!-- <div style="margin: 20px;" v-for="(img, index) in bookMsg.imgs" :key="index">
          <img float:left style=" width:60px;" :src="img.dir" />
        </div> -->
        <ul>
          <li v-for="(img, index) in bookMsg.imgs" :key="index" @click="handleEnlarge(img.dir)" >
            <img :src="img.dir" alt=""  />
          </li>
        </ul>
      </div>
      <div class="msgTitle" style="line-height:200%">
        商品评论
      </div>
      <div>
        <el-table :data="comments" style="width:100%">
          <el-table-column prop="name" label="用户" width="200"></el-table-column>
          <el-table-column prop="time" label="发布时间" width="200" sortable></el-table-column>
          <el-table-column prop="comment" label="评论内容"></el-table-column>
        </el-table>
      </div>
    </div>
    <el-footer>
      <!--Footer-->
    </el-footer>
    <el-dialog title="" 
      :visible.sync="isEnlargeImage" 
      :modal-append-to-body="false" 
      top="8%" 
      width="60%">
        <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
  </el-container>
</template>

<script>
export default {
  name: 'itemDetail',
  data() {
    return {
      isEnlargeImage:false,
      enlargeImage:'',
      bookInfo: [],
      stuID: '',
      bookMsg: {
        id: '',
        name: '',
        price: '',
        qq: '',
        stuName: '',
        abs: '',
        cover: '',
        imgs: [],
        
      },
      comments: [
        {
          name: 'Lana Del Rey',
          comment: '我发布一张新专辑Norman Fucking Rockwell,大家快来听啊',
          time: '2019年9月16日 18:43',
        },
        {
          name: 'Taylor Swift',
          comment: '我发行了我的新专辑Lover',
          time: '2019年9月16日 18:43',
        },
        {
          name: 'Norman Fucking Rockwell',
          comment: 'Plz buy Norman Fucking Rockwell on everywhere',
          time: '2019年9月16日 18:43',
        },
      ],
    }
  },
  methods: {
    addToCart() {
      console.log(this.stuID)
      console.log(this.bookMsg.id)
      this.$axios
        .post('/student/add_cart', {
          studentID: this.stuID,
          commodityID: this.bookMsg.id,
        })
        .then((resp) => {
          console.log(resp)
          if (resp && resp.status === 200) {
            this.books = resp.data
          }
        })
      alert('添加到购物车！')
    },
    handleEnlarge(dir){
      console.log(dir);
      if(dir){
        this.enlargeImage = dir;
        this.isEnlargeImage = !this.isEnlargeImage;
      }
    }
  },

  created() {
    console.log('item created')
    console.log(this.$route.query)
    this.bookMsg.id = this.$route.query.id
  },
  mounted() {
    this.$axios
      .post('/commodity/get', {
        commodityID: this.bookMsg.id,
      })
      .then((resp) => {
        console.log(resp)
        if (resp && resp.status === 200) {
          console.log(resp.data)
          this.bookMsg.name = resp.data.name
          this.bookMsg.cover = resp.data.cover.dir
          this.bookMsg.price = resp.data.price
          this.bookMsg.abs = resp.data.description
          this.bookMsg.imgs = resp.data.pictures
          this.bookMsg.qq = resp.data.student.qq
          this.bookMsg.stuName = resp.data.student.name
          this.stuID = window.sessionStorage.getItem('user')
        }
      })
  },
}
</script>

<style scoped>
#box ul {
  display: flex;
  flex-wrap: wrap;
}
#box li {
  padding: 3px;
  list-style: none;
  margin-right: 15px;
  border: 1px solid #eee;
  cursor: pointer;
}
#box img {
  width: 200px;
  height: 150px;
}
.abs {
  margin: 20px;
  border: 2px;
  /* width:850px;padding-left:20px; */
  text-align: left;
}
.center {
  margin-left: 80px;
  margin-right: 80px;
  margin-top: 40px;
}
.msgTitle {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
  font-size: 20px;
  font-weight: bold;
  line-height: 60px;
  text-align: left;
  padding-left: 30px;
  margin-top: 20px;
}
.div-msg {
  margin: 30px;
}
.el-main {
  margin: 40px 80px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  color: #333;
}

.col-left {
  cursor: pointer;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  padding: 20px;
}
.img-title {
  width: 200px;
  height: 300px;
}
.col-main {
  width: 300px;
  color: #666;
  text-align: left;
  padding: 20px;
  overflow: hidden;
}
.el-header {
  background-color: white;
  color: #333;
  text-align: center;
  line-height: 60px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.12), 0 0 6px rgba(0, 0, 0, 0.04);
}
.el-footer {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.spanTitle {
  position: absolute;
  left: 2%;
  font-size: 20px;
  font-weight: bold;
  color: #37a8ff;
  cursor: pointer;
  text-decoration: none;
}


</style>
