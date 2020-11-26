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
              <a href="">{{ item.name.length > 8 ? item.name.substr(0, 7) + '…' : item.name }}</a>
            </div>
            <!--  -->
            <i class="el-icon-delete" @click="deleteBook(item.id)"></i>
            <i class="el-icon-edit" @click="editBook(item.id)" v-if="showEdit"></i>
          </div>
          
          <div class="author" style="color: #ee231e;">{{ item.price }}元</div>
        </el-card>
      </el-tooltip>
      
    </el-row>
    <el-row>
      <el-pagination @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :total="books.length"> </el-pagination>
    </el-row>
    
    <el-dialog title="修改商品信息" :visible.sync="editFormVisible" width="60%" top="5vh">
      <el-scrollbar style="height:400px;" wrap-style="overflow-x:hidden;">
      <el-form class="form-container" label-width="80px" :rules="commodity_rules" :model="commodityForm" ref="commodityForm">
        <el-form-item label="商品编号">
          <el-input v-model="commodity_id" disabled></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="name">
          <el-input v-model="commodityForm.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品描述" prop="description">
         <el-input v-model="commodityForm.description" placeholder="请输入商品描述" type="textarea" resize="none" rows="5"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="price">
          <el-input v-model="commodityForm.price" placeholder="请输入商品价格，单位为人民币"></el-input>
        </el-form-item>
        <el-form-item label="封面图片" prop="price">
          <upload-picture-list :fileList="imgListCover" :img_limit="1" :onRemoveFromFather="onRemoveFromFatherCover" :onSuccessFromFather="onSuccessFromFatherCover"></upload-picture-list>
        </el-form-item>
        <el-form-item label="描述图片" prop="price">
          <upload-picture-list :fileList="imgList" :img_limit="5" :onRemoveFromFather="onRemoveFromFatherImage" :onSuccessFromFather="onSuccessFromFatherImage"></upload-picture-list>
        </el-form-item>
      </el-form>
      </el-scrollbar>
      <span slot="footer" class="dialog-footer">
        <el-button @click="function(){editFormVisible=false;reset();}">取 消</el-button>
        <el-button type="primary" @click="editBookSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import UploadPictureList from '../common/UploadPictureList.vue'
export default {
  props:{
    dataSourceAPI:{ type: String, default:'/student/get_release'},
    showEdit:{type: Boolean, default: true},
  },
  components: { UploadPictureList },
  name: 'Books',
  data() {
    return {
      books: [],
      currentPage: 1,
      pageSize: 18,
      BookMsg: 'BookMsg',
      commodity_id:'null',
      commodityForm:{
                name:'',
                description:'',
                price:''
            },
      commodity_rules:{
          name:[{required:true, message:'请输入商品名称',trigger:'blur'},{ min: 2, max: 40, message: '最少输入2个字，最长输入40个字！你输入了个字', trigger: 'blur' }],
          description:[{required:true, message:'请输入商品描述',trigger:'blur'},{ min: 5, max: 2000, message: '最少输入2个字，最长输入2000个字！你输入了个字', trigger: 'blur' }],
          price:[{required:true,message:'请输入商品价格',trigger:'blur'},{ validator:(rule,value,callback)=>{
              if(value==='') { callback(new Error('请输入商品价格')) }
              else if(!/^[0-9]{1,8}(\.[0-9]{1,2})?$/.test(this.commodityForm.price)){ callback(new Error('商品价格需为不超过一亿的整数或一位或两位小数！')) }
              else{ callback() }}, trigger:'blur'}]
      },
      editFormVisible: false,
      imgList:[],
      imgListCover:[],

    }
  },
  //挂载数据后执行
  mounted() {
    this.loadBooks()
    this.$bus.on('changeCurrentPage', (val) => {
      this.currentPage = val
    })
    console.log('金坷垃',this.showEdit);
  },
  destroyed() {
    this.$bus.off('changeCurrentPage')
  },

  methods: {
    reset(){
      this.commodityForm.name = '';
      this.commodityForm.description= '';
      this.commodityForm.price = '';
      this.imgList=[];
      this.imgListCover=[];
    },
    onRemoveFromFatherCover(file_path,index){
      this.$axios.post('/commodity/delete_cover',{imageName:file_path}).then(res=>{
        if(eval(res.data)['is_success']=='true'){
            this.$message({
            type: 'success',
            message: '删除成功'})
            this.imgListCover.splice(index, 1)
        }
        else{
            this.$notify.error({title:'删除失败！',message: eval(res.data)['description']})
        }
      })
    },
    onSuccessFromFatherCover(file_path){
      this.$axios.post('/commodity/add_cover',{imageName:file_path,commodityID:this.commodity_id}).then(res=>{
        if(eval(res.data)['is_success']=='true'){
            console.log(file_path,'上传成功')
        }
        else{
            this.$notify.error({title:'更新到数据库失败！',message: eval(res.data)['description']})
        }
      })
    },


    onSuccessFromFatherImage(file_path){
      this.$axios.post('/commodity/add_images',{imageNames:file_path,commodityID:this.commodity_id}).then(res=>{
        if(eval(res.data)['is_success']=='true'){
            console.log(file_path,'上传成功')
        }
        else{
            this.$notify.error({title:'更新到数据库失败！',message: eval(res.data)['description']})
        }
      })
    },
    onRemoveFromFatherImage(file_path,index){
      this.$axios.post('/commodity/delete_img',{imageName:file_path}).then(res=>{
        if(eval(res.data)['is_success']=='true'){
            this.$message({
            type: 'success',
            message: '删除成功'})
            this.imgList.splice(index, 1)
        }
        else{
            this.$notify.error({title:'删除失败！',message: eval(res.data)['description']})
        }
      })
    }, 


    loadBooks() {
      console.log('loading books-------------')
      console.log(this)

      this.$axios
        .post(this.dataSourceAPI, {
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
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
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
    editBook(item_id) {
      this.editFormVisible = true;
      this.$axios.post('/commodity/get',{commodityID:item_id}).then(res=>{
        if(res.data == null){
          this.$message.error('该商品可能已被删除！请刷新页面重试！商品编号：'+item_id.toString())
          return
        }
        console.log(res.data)
        this.commodityForm.name = res.data.name
        this.commodityForm.description = res.data.description
        this.commodityForm.price = res.data.price
        this.commodity_id = res.data.id
        for (let index = 0; index < res.data.pictures.length; index++) {
          this.imgList.push({path:res.data.pictures[index].dir});
        }
        this.imgListCover.push({path:res.data.cover.dir});
      }).catch(failResponse => {
            this.$notify.error({title: '获取商品详情异常！',message: failResponse.data});
      })
    },
    editBookSubmit(){
      this.$axios.post('/commodity/update',{
          commodityID:this.commodity_id,
          name:this.commodityForm.name,
          description:this.commodityForm.description,
          price:this.commodityForm.price,
        }).then(res=>{
          if(eval(res.data)['is_success'] == 'true'){
              this.$message({ type: 'success', message: '修改成功'})
              this.reset();
              this.editFormVisible = false;
          }else{
              this.$notify.error({title:'修改失败！',message: eval(res.data)['description']})
          }
        }).catch(failResponse => {
          this.$notify.error({title: '修改异常！',message: failResponse.data});
        })
    }
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

.el-icon-edit {
  cursor: pointer;
  float: right;
  margin-right: 10px;
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
