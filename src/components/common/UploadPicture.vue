<template>
    <div>
        <el-upload
        action="api/api/uploadImg"
        list-type="picture-card"
        accept="image/*"
        :limit="imgLimit"
        :file-list="productImgs"
        :multiple="isMultiple"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-success="handleAvatarSuccess"
        :before-upload="beforeAvatarUpload"
        :on-exceed="handleExceed"
        :on-error="imgUploadError">
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
      <el-button @click="printFileList">打印FileList</el-button>
    </div>
</template>

<script>
export default {
    name:"UploadPicture",
    data() {
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        productImgs: [],
        isMultiple: true,
        imgLimit: 3
      }
    },
    update() {
      this.productImgs[0] = { name: "123.jpg" ,url: "http://125.216.249.215:45678/api/file/SXcKoicKlwjfif.jpg" };
    },
    methods: {
      handleRemove(file, fileList) {//移除图片
        console.log(file, fileList);
      },
      printFileList() {
        console.log(this.productImgs);
      },
      handlePictureCardPreview(file) {//预览图片时调用
        console.log(file);
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
 
      beforeAvatarUpload(file) {//文件上传之前调用做一些拦截限制
        console.log(file);
        const isJPG = true;
        // const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;
 
        // if (!isJPG) {
        //   this.$message.error('上传头像图片只能是 JPG 格式!');
        // }
        // if (!isLt2M) {
        //   this.$message.error('上传图片大小不能超过 2MB!');
        // }
        //return isJPG && isLt2M;
        return true;
      },
      handleAvatarSuccess(res, file, fileList) {//图片上传成功
        console.log(res);
        console.log(file);
        console.log('成功的FileList: ',fileList)
        console.log('list: ',this.productImgs)
        this.imageUrl = URL.createObjectURL(file.raw);
      },
      handleExceed(files, fileList) {//图片上传超过数量限制
        this.$message.error('上传图片不能超过6张!');
        console.log(file, fileList);
      },
      imgUploadError(err, file, fileList){//图片上传失败调用
        console.log(err)
        this.$message.error('上传图片失败!');
      }
    }
  }
</script>

<style scoped>

</style>