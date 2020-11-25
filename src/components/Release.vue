<template>
    <div class="background">
        <el-form class="form-container" label-width="80px" :rules="commodity_rules" :model="commodityForm" ref="commodityForm">
            <div v-if="active == 0">
                <h3>发布新商品</h3>
                <el-form-item label="商品名称" prop="name">
                    <el-input v-model="commodityForm.name" placeholder="请输入商品名称"></el-input>
                </el-form-item>
                <el-form-item label="商品描述" prop="description">
                    <el-input v-model="commodityForm.description" placeholder="请输入商品描述" type="textarea" resize="none" rows="5"></el-input>
                </el-form-item>
                <el-form-item label="商品价格" prop="price">
                    <el-input v-model="commodityForm.price" placeholder="请输入商品价格，单位为人民币"></el-input>
                </el-form-item>
                <el-button @click="active=1" style="border: none;width:40%;" :type="uploadCoverType">{{uploadCoverText}}</el-button>
                <el-button @click="active=2" style="border: none;width:40%;" :type="uploadImageType">{{uploadImageText}}</el-button>
                <el-button @click="submit" type="primary" style="border: none;width:100%; margin-top: 20px">提交</el-button>
            </div>
            <div v-if="active == 1">
                <h3>上传封面</h3>
                <upload-picture-list :fileList="imgListCover" :img_limit="1" :onRemoveFromFather="onRemoveFromFatherCover" :onSuccessFromFather="null"></upload-picture-list>
                <el-button @click="backClick">返 回</el-button>
            </div>
            <div v-if="active == 2">
                <h3>上传描述图片</h3>
                <upload-picture-list :fileList="imgList" :img_limit="5" :onRemoveFromFather="onRemoveFromFatherImage" :onSuccessFromFather="null"></upload-picture-list>
                <el-button @click="backClick">返 回</el-button>
            </div>
        </el-form>
        <!-- <el-dialog title="上传封面" :visible.sync="uploadCoverImage" width="40%">
            <el-button>asdfasdfda</el-button>
            <div slot="footer">
                <el-button @click="uploadCoverImage = false">关 闭</el-button>
            </div>
        </el-dialog>
        <el-dialog title="上传描述图片" :visible.sync="uploadImage" width="40%">
            <el-button>asdfasdfda</el-button>
            <div slot="footer">
                <el-button @click="uploadImage = false">关 闭</el-button>
            </div>
        </el-dialog> -->
    </div>
</template>
<script>
import UploadPictureList from './common/UploadPictureList.vue'
export default {
    components: { UploadPictureList },
    name:'release',
    data(){
        return{
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
            uploadCoverImage: false,
            uploadImage: false,
            active: 0,
            imgList:[],
            imgListCover:[],
            uploadCoverText:'上传封面图片(当前未上传)',
            uploadImageText:'上传描述图片(当前未上传)',
            uploadCoverType:'info',
            uploadImageType:'info',
        }
    },
    methods:{
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
        reset(){
            this.commodityForm.name = '';
            this.commodityForm.description= '';
            this.commodityForm.price = '';
            this.imgList=[];
            this.imgListCover=[];
            this.uploadCoverText='上传封面图片(当前未上传)';
            this.uploadImageText='上传描述图片(当前未上传)';
            this.uploadCoverType='info';
            this.uploadImageType='info';
        },
        submit(){
            //alert('提交！')
            console.log(this.commodityForm.description)
            if(this.imgList.length == 0){
                this.$message.error('至少要提交1张描述图片！');
                return
            }
            if(this.imgListCover.length == 0){
                this.$message.error('须提交封面图片！');
                return
            }
            if(this.submitFormCheck('commodityForm')){
                var imgPathList = [];
                for(var i = 0;i < this.imgList.length; i++){
                    imgPathList.push(this.imgList[i].path);
                }
                this.$axios.post('/student/add_commodity',{
                    studentID:window.sessionStorage.getItem('user'),
                    coverName:this.imgListCover[0].path,
                    imageNames:imgPathList.toString(),
                    name:this.commodityForm.name,
                    description:this.commodityForm.description,
                    price:this.commodityForm.price,
                }).then(res=>{
                    if(eval(res.data)['is_success'] == 'true'){
                        this.$message({ type: 'success', message: '添加成功'})
                        this.reset();
                    }else{
                        this.$notify.error({title:'添加失败！',message: eval(res.data)['description']})
                    }
                }).catch(failResponse => {
                    this.$notify.error({title: '添加异常！',message: failResponse.data});
                })
            }
            
        },
        backClick(){
            if(this.imgList.length!=0){
                this.uploadImageText='上传描述图片(已上传'+this.imgList.length+'张)';
                this.uploadImageType='success'
            }
            if(this.imgListCover.length!=0){
                this.uploadCoverText='上传封面图片(已上传'+this.imgListCover.length+'张)';
                this.uploadCoverType='success'
            }
            this.active = 0;
        },
        submitFormCheck(formName) {
            var result;
            this.$refs[formName].validate((valid) => {
              if (valid) {
                console.log(formName+' submit successful!');
                result = true;
              } else {
                console.log(formName+' error submit!!');
                result = false;
              }
            });
            return result;
        },

    }
}
</script>
<style scoped>
    .background{
        width:100%;
        height:91%;
        background-image: url("https://ss2.meipian.me/users/19756099/49553a701b3347ee955032a709386316.jpg");
        background-position-x: 0px;
        background-position-y: -100px;
        background-size: 100%;
        background-repeat: no-repeat;
        z-index:-1;
        position: absolute;
    }
    .form-container {
      border-radius: 30px;
      background-clip: padding-box;
      margin: 40px auto;
      width: 700px;
      padding: 15px 35px 30px 35px;
      background: #ffffff;
      border: 1px solid #eaeaea;
      box-shadow: 0 0 25px #cac6c6;
      opacity: 0.95;
    }
</style>