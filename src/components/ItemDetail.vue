<template>
  <el-container>
    <el-header height="60px">
      <router-link class="spanTitle" to="/index" target="_self">
        South China University of Technology Commercial Platform
      </router-link>
    </el-header>
    <el-main class="el-main" v-if="idIsValid">
      <div style=" margin-top: 30px;">
        <div style="margin-left: 200px; float: left;">
          <div class="col-left" @click="handleEnlarge(itemMsg.cover)">
            <img :src="itemMsg.cover" class="img-title" style="width: 300px;" />
          </div>
        </div>
        <div class="col-main">
          <div class="div-msg" style="width:300px">
            商品名：<span style="color: #d6524a;">{{ itemMsg.name }}</span>
          </div>
          <div class="div-msg" style="width:300px">
            价格：<span style="color: #ff4400;font-size:26px">{{ itemMsg.price }}</span>
          </div>
          <div class="div-msg" style="width:300px">发布者：{{ itemMsg.stuName }}</div>
          <div class="div-msg" style="width:300px">联系方式（QQ号）：{{ itemMsg.qq }}</div>

          <div class=" div-msg">
            <el-button type="primary" style="width: 150px;height: 50px;" @click="addToCart">添加到购物车</el-button>
          </div>
        </div>
      </div>
    </el-main>
    <div class="center" v-if="idIsValid">
      <div class="msgTitle">
        详情描述
      </div>
      <div class="abs" v-html="itemMsg.abs"></div>
      <div class="msgTitle">
        详细图片
      </div>

      <div id="box">
        <!-- <div style="margin: 20px;" v-for="(img, index) in itemMsg.imgs" :key="index">
          <img float:left style=" width:60px;" :src="img.dir" />
        </div> -->
        <ul>
          <li v-for="(img, index) in itemMsg.imgs" :key="index" @click="handleEnlarge(img.dir)" >
            <img :src="img.dir" alt=""  />
          </li>
        </ul>
      </div>
      <div class="msgTitle" style="line-height:200%">
        商品评论
      </div>
      <div>
        <el-table :data="comments" style="width:100%" empty-text="这个商品还没有评论嗷">
          <el-table-column prop="name" label="用户" width="200"></el-table-column>
          <el-table-column prop="time" label="发布时间" width="200" sortable></el-table-column>
          <el-table-column prop="comment" label="评论内容"></el-table-column>
          <el-table-column label="操作" width="200px">
            <template slot-scope="scope">
              <div v-if="identityCheck(scope.row.studentId)">
                <el-button size="mini" type="primary" @click="editComment(scope.$index, scope.row)">编辑</el-button>
                <el-button size="mini" type="danger" @click="deleteComment(scope.$index, scope.row)">删除</el-button>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-footer v-if="idIsValid">
      <!--Footer-->
    </el-footer>
    <el-dialog title="" 
      :visible.sync="isEnlargeImage" 
      :modal-append-to-body="false" 
      top="8%" 
      width="60%">
        <img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
    </el-dialog>
    <div v-if="idIsValid == false">
      <h1>
        该商品不存在或已被删除！
      </h1>
    </div>
  </el-container>
</template>

<script>
import { getCurrentTime } from '../assets/constants'
export default {
  name: 'itemDetail',
  data() {
    return {
      isEnlargeImage:false,
      enlargeImage:'',
      itemInfo: [],
      stuID: '',
      idIsValid: false,
      itemMsg: {
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
        
      ],
    }
  },
  methods: {
    editComment(index,row){
      this.$prompt('年轻人，请输入你的评论', '来评', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputType:'textarea',
          inputValue:row.comment,
          inputValidator: (val) => {
            if (val.length < 3 || val.length > 200) return '最少输入3个字，最长输入200个字！你输入了'+val.length+'个字'
          },
        }).then(({ value }) => {
          this.$axios.post('/student/modify_comment',{
            commentID:row.commentId,
            content:value,
            time:getCurrentTime()
            }).then(res=>{
              if(eval(res.data)['is_success'] == 'true'){
                this.$message({message:'修改成功！请刷新页面后查看修改后评论',type:'success',center:true,showClose:true})
              }else{
                  this.$notify.error({title: '添加评论失败',message: eval(res.data)['description']})                
              }
            }).catch(failResponse => {
              this.$notify.error({title: '修改评论异常！',message: failResponse.message});
            })
        })
    },
    deleteComment(index,row){
        this.$confirm('删除后订单的“已评论”状态将不会回滚至可添加评论的“已收货”状态，确定删除这条评论吗?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.post('/student/delete_comment',{commentID:row.commentId,}).then(res=>{
            if(eval(res.data)['is_success'] == 'true'){
                this.$message({message:'删除成功！',type:'success',center:true,showClose:true})
            }else{
                this.$notify.error({title: '删除评论失败',message: eval(res.data)['description']})                
            }
          }).catch(failResponse => {
            this.$notify.error({title: '删除评论异常！',message: failResponse.message});
          })
        })
    },
    identityCheck(id){
      return id == window.sessionStorage.getItem('user')
    },
    addToCart() {
      console.log(this.stuID)
      console.log(this.itemMsg.id)
      if(window.sessionStorage.getItem('user_type') === 'admin'){
        this.$notify.error({title: '添加失败！',message: '管理员不能添加商品到购物车，请使用学生账号！'});
        return
      }
      this.$axios
        .post('/student/add_cart', {
          studentID: this.stuID,
          commodityID: this.itemMsg.id,
        })
        .then((resp) => {
          if (eval(resp.data)['is_success'] === 'true') {
            this.$message({message:'添加成功！',type:'success',center:true,showClose:true})
          }else{
            this.$notify.error({title: '添加失败！',message: eval(resp.data)['description']});
          }
        }).catch(err=>{
          this.$notify.error({title: '添加异常！',message: err.message});
        })
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
    this.itemMsg.id = this.$route.query.id
  },
  mounted() {
    this.$axios
      .post('/commodity/get', {
        commodityID: this.itemMsg.id,
      })
      .then((resp) => {
        console.log(resp)
        if (resp && resp.status === 200) {
          console.log(resp.data)
          if(resp.data == null){
            this.idIsValid = false;
            return;
          }
          this.idIsValid = true;
          this.itemMsg.name = resp.data.name
          this.itemMsg.cover = resp.data.cover.dir
          this.itemMsg.price = resp.data.price
          this.itemMsg.abs = resp.data.description.replaceAll("\n","<br>");
          this.itemMsg.imgs = resp.data.pictures
          this.itemMsg.qq = resp.data.student.qq
          this.itemMsg.stuName = resp.data.student.name
          this.stuID = window.sessionStorage.getItem('user')
        }
      }).catch(failResponse => {
        console.log(failResponse)
        this.$notify.error({title: '拉取商品信息失败',message: failResponse});
      })
    this.$axios.post('/commodity/get_comments',{commodityID:this.itemMsg.id}).then(res=>{
      this.comments.length = 0;
      for (let index = 0; index < res.data.length; index++) {
        const element = res.data[index];
        console.log(element)
        this.comments.push({
          commentId: element.id,
          studentId: element.student.studentId,
          name: element.student.name,
          comment: element.content,
          time: element.time,
        })
      }
    }).catch(failResponse => {
        this.$notify.error({title: '拉取商品评论失败',message: failResponse.data});
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
