<template>
    <div style="margin-left:20px">
        <!-- <upload-picture></upload-picture> -->
        <!-- <upload-picture-list></upload-picture-list> -->
        <upload-picture-list></upload-picture-list>
        <el-button @click="test">删除测试</el-button>
    </div>
</template>
<script>
import UploadPictureList from '../common/UploadPictureList.vue'

export default {
  components: { UploadPictureList },
    name:"info",
    methods:{
        test(){
            this.$axios.post('debug/commodity/delete_image',{image_name:'qAMdWcFWRk.jpg'}).then(res=>{
                console.log(res.data)
            })
        }
    }
    
}
</script>