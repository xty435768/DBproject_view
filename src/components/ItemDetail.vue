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
          <div class="col-left">
            <img :src="bookMsg.cover" class="img-title" style="width: 300px;" />
          </div>
        </div>
        <div class="col-main">
          <div class="div-msg" style="width:300px">
            商品名：<span style="color: #d6524a;">{{ bookMsg.title }}</span>
          </div>
          <div class="div-msg" style="width:300px">
            价格：<span style="color: #ff4400;font-size:26px">{{ bookMsg.price }}</span>
          </div>
          <div class="div-msg" style="width:300px">发布者：{{ bookMsg.author }}</div>
          <div class="div-msg" style="width:300px">联系方式（QQ号）：{{ bookMsg.qq }}</div>
          <!-- <div class=" div-msg">
                        价&nbsp;格&nbsp;:&nbsp;<span style="color: #d6524a;">{{bookMsg.price}}&nbsp;元</span>
                    </div>
                    <div class=" div-msg">
                        新&nbsp;旧&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.newOld}}</span>
                    </div>
                    <div class=" div-msg">
                        区&nbsp;域&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.area}}</span>
                    </div>
                    <div class=" div-msg">
                        联&nbsp;系&nbsp;人&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.contact}}</span>
                    </div>
                    <div class=" div-msg">
                        电&nbsp;话&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.phone}}</span>
                    </div>
                    <div class=" div-msg">
                        Q&nbsp;Q&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.qq}}</span>
                    </div>
                    <div class=" div-msg">
                        微&nbsp;信&nbsp;:&nbsp;<span style="color: #000000;">{{bookMsg.weChat}}</span>
                    </div> -->
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
      <div style="margin-top: 40px;">
        <div style="margin: 20px;" v-for="(img, index) in bookMsg.imgs" :key="index">
          <img style=" width:600px;" :src="img.img" />
        </div>
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
  </el-container>
</template>

<script>
export default {
  name: 'itemDetail',
  data() {
    return {
      bookMsg: {
        title: '',
        cover: '',
        price: '',
        date: '',
        newOld: '',
        contact: '',
        area: '江苏大学',
        phone: '',
        qq: '',
        weChat: '',
        abs: '',
        imgs: [{ img: '' }, { img: '' }, { img: '' }, { img: '' }, { img: '' }],
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
      this.$axios
        .post('/student/add_cart', {
          studentID: 'admin',
          commodityID: ''
        })
        .then((resp) => {
          console.log(resp)
          if (resp && resp.status === 200) {
            this.books = resp.data
          }
        })
      alert('添加到购物车！')
    },
  },

  created() {
    this.bookMsg.title = this.$route.query.title
    this.bookMsg.cover = this.$route.query.cover
    this.bookMsg.price = this.$route.query.price
    this.bookMsg.author = this.$route.query.author
    this.bookMsg.date = this.$route.query.date
    this.bookMsg.newOld = this.$route.query.newOld
    this.bookMsg.contact = this.$route.query.contact
    this.bookMsg.phone = this.$route.query.phone
    this.bookMsg.qq = this.$route.query.qq
    this.bookMsg.weChat = this.$route.query.weChat
    //this.bookMsg.abs=this.$route.query.abs;
    this.bookMsg.abs =
      '朋友们好啊我是浑元形意戳一戳掌门人马保国。\
                刚才有个朋友问我马老师发生什么事了，我说怎么回事，给我发了一几张截图，我一看！嗷！原来是昨天，有两个年轻人，\
                三十多岁，一个体重，九十多公斤，一个体重八十多公斤，他们说，唉…有一个说是我在爱乐土豪群练戳一戳指头练坏了，\
                马老师你能不能教教我浑元指法，矮…帮助治疗一下，我的指关节。我说可以。我说你在土豪群练死劲儿，不好用，他不服气。\
                我说小朋友：你两个手来找我一个手指头，他找不动。<br>他说你这也没用。我说我这个有用，这是化劲儿，传统戳一戳是讲化劲儿的\
                四两拨千金。二百多斤的英国大力士，动我不动我这一个手指头。啊…哈！他非和我试试，我说可以。诶…我一说的啪就站起来了，\
                很快啊！然后上来就是一个左戳戳一个右戳戳一个左戳戳，我全部防区防出去了啊防出去以后自然是传统指法以点到为止右指放到他头像\
                上没戳他，我笑一下准备收指，由这时间，欸传统戳一戳的点到为止他已经输了，如果这一指发力，一戳就把他戳出来了，放在头像上\
                没有戳他，他也承认，我先戳到他头像。他不知道指头放在他头像上，他承认我先戳到他头像，啊，我收指的时间不戳了，他突然袭击来戳\
                我头像，啊，我大意了啊，没有闪，矮…他的左指头给我用户名，啊，用户名，蹭了一下，但没关系啊！<br>他也说，啊他截图也说了，两分多\
                钟以后，当时用户名戳出来了了，捂着屏幕，我说停停。然后两分钟钟以后，两分多钟以后诶就没人记得了，我说小伙子你不讲武德你不懂\
                ，我说马老师对不对不起，我不懂规矩。啊，我是…他说他是乱打的，他可不是乱打的啊，训练有素，后来他说他练过三四年一阳指，啊，\
                看来是有备而来！这两个年轻人不讲武德，来骗，来偷袭，我六十九岁的老账号，这好吗？这不好，我劝这位年轻人好自为之，好好反思，\
                以后不要再犯这样的聪明，小聪明，啊，呃…武林要以和为贵，要讲武德，不要搞窝里斗，谢谢朋友们！😁😂'
    this.bookMsg.imgs[0].img = this.$route.query.img_1
    this.bookMsg.imgs[1].img = this.$route.query.img_2
    this.bookMsg.imgs[2].img = this.$route.query.img_3
    this.bookMsg.imgs[3].img = this.$route.query.img_4
    this.bookMsg.imgs[4].img = this.$route.query.img_5
  },
}
</script>

<style scoped>
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
