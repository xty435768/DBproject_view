<template>
    <div class="img-list">
        <div class="img-li-box" v-for="(item,key) in imgList" :key="key">
            <img class="img-li-b--url" :src="item.path"> <!-- 这里之前是item.url -->
            <div class="img-li-b--bottom">
                <!-- <div class="img-li-b--name">{{ item.name }}</div> -->
                <!-- <el-button type="text" @click="handleFileName(item,key)" disabled>修改名字</el-button> -->
            </div>

            <!-- 删除icon -->
            <div class="img-li-b--delete">
                <i @click="handleFileRemove(item,key)" class="el-icon-delete"></i>
            </div>

            <!-- 放大icon -->
            <div class="img-li-b--layer" @click="handleFileEnlarge(item.path)"> <!-- 这里之前是item.url -->
                <i class="el-icon-view"></i>
            </div>
        </div>

        <!-- 上传进度 -->
        <div v-if="!pass && progress !== 0" class="img-li-box img-li-b--progress">
            <el-progress type="circle" :percentage="progress" :status="proStatus"></el-progress>
        </div>

        <!-- 上传按钮 -->
        <div class="img-li-b--upload">
            <el-upload class="img-li-b--upl--field"
            	accept="image/*" 
            	ref="upload" 
            	list-type="picture-card" 
            	:show-file-list="false" 
            	:action="params.action" 
            	:data="params.data" 
                
            	:on-change="uploadOnChange" 
            	:on-success="uploadOnSuccess" 
            	:on-error="uploadOnError"
                :before-upload="beforeUpload"
            	:on-progress="uploadOnProgress">
                	<el-button type="primary">点击上传</el-button>
            </el-upload>
        </div>

        <!-- 放大弹窗 -->
        <el-dialog title="" 
        	:visible.sync="isEnlargeImage" 
        	:modal-append-to-body="false" 
        	top="8%" 
        	width="60%">
            	<img @click="isEnlargeImage = false" style="width:100%;" :src="enlargeImage">
        </el-dialog>
    </div>
</template>

<script>
export default {
    //props:['fileList','img_limit'],
    props:{
        fileList:{ type: Array, required:true},
        img_limit:{ type:Number, default:99 },
        onSuccessFromFather:{ type:Function, required:true},
        onRemoveFromFather:{ type:Function, required:true},
    },
    name: 'upload-list',
    data() {
        return {
            progress: 0, //上传进度
            pass: null, //是否上传成功
            isEnlargeImage: false, //放大图片
            enlargeImage: '', //放大图片地址
            imgList: this.fileList,
            imgLimit: this.img_limit,
            params: {
                //action: 'api/api/uploadImg',
                action:'/api/commodity/upload_image',
                data: {}
            }
        }
    },
    computed: {
        proStatus() { //上传状态
            if (this.pass) {
                return 'success'
            } else if (this.pass === false) {
                return 'exception'
            } else {
                return 'text'
            }
        }
    },
    methods: {
        uploadOnProgress(e, file) { //开始上传
            console.log(e.percent, file)
            this.progress = Math.floor(e.percent)
        },
        uploadOnChange(file) {
            console.log("——————————change——————————")
            // console.log(file)
            if (file.status == 'ready') {
                console.log("ready")
                this.pass = null;
                this.progress = 0;
            } else if (file.status == 'fail') {
                this.$message.error("图片上传出错，请刷新重试！")
            }
        },
        uploadOnSuccess(e, file) { //上传附件
            console.log("——————————success——————————")
            this.pass = true;
            this.$message.success("上传成功")
            this.imgList.push({
                url: file.url,
                name: '新增图片',
                path: e,
            })
            //console.log(this.imgList)
            if(this.onSuccessFromFather){
                //onSuccessFromFather是可选的，主要是为了同步数据库
                this.onSuccessFromFather(e);
            }
            console.log('事件响应：',e)
            //this.$emit('fileList',)
        },
        uploadOnError(e, file) {
            console.log("——————————error——————————")
            console.log(e)
            this.pass = false;
        },
        handleFileEnlarge(_url) { //放大图片
            console.log(_url)
            if (_url) {
                this.enlargeImage = _url;
                this.isEnlargeImage = !this.isEnlargeImage;
            }
        },
        handleFileName(file, i) { //修改名字
            console.log(file, i)
            let that = this;
            this.$prompt("请输入新文件名：", "提示：", {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                console.log(value)
                if (!value) {
                    return false;
                }
                //可添加ajax
                this.$set(this.imgList[i], 'name', value)
                this.$message.success("操作成功")
            }).catch(() => {})
        },
        handleFileRemove(file, index) { //删除图片
            console.log(file, index)
            if (!file.path) {
                return false;
            }
            let that = this;
            this.$confirm('是否删除此文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.onRemoveFromFather){
                    //必须指定onRemoveFromFather，该函数返回true则同意删除
                    this.onRemoveFromFather(file.path,index)
                    
                }
            }).catch((meg) => console.log(meg))
        },
        beforeUpload(file){ //上传前校验
            console.log('限制',this.img_limit)
            const isImage = (file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/jfif' ||
                            file.type === 'image/png' || file.type === 'image/bmp' );
            const isLt2M = file.size / 1024 / 1024 < 2;
            if (!isImage) {
                this.$message.error('仅以下格式的图片可以上传：JPEG, JPG, JFIF, PNG, BMP');
            }
            if (!isLt2M) {
                this.$message.error('上传图片大小不能超过 2MB!');
            }
            if (this.imgList.length == this.imgLimit){
                this.$message.error('最多只能上传'+this.imgLimit.toString()+'张图片嗷~~┗|｀O′|┛');
                return false;
            }
            return isImage && isLt2M;
        },
    }
}
</script>

<style lang="scss">
	.img-list {
	    overflow: hidden;
	    width: 100%;


	    // 文件列表
	    .img-li-box {
	        float: left;
	        text-align: left;
	        position: relative;
	        display: inline-block;
	        width: 200px;
	        height: 270px;
	        padding: 5px;
	        margin: 5px 20px 20px 0;
	        border: 1px solid #d1dbe5;
	        border-radius: 4px;
	        transition: all .3s;
	        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, .12), 0 0 6px 0 rgba(0, 0, 0, .04);

	        // 图片
	        .img-li-b--url {
	            display: block;
	            width: 100%;
	            height: 190px;
	            margin: 0 auto;
	            border-radius: 4px;
	        }

	        // 底部
	        .img-li-b--bottom {
	            margin-top: 10px;

	            // 名称
	            .img-li-b--name {
	                width: 90%;
	                text-overflow: ellipsis;
	                overflow: hidden;
	                height: 25px;
	                line-height: 25px;
	            }
	        }

	        // 删除按钮
	        .img-li-b--delete {
	            position: absolute;
	            bottom: 10px;
	            right: 10px;
	            color: #8492a6;
	            cursor: pointer;
	            font-size: 1.1em;
	        }

	        // 放大遮罩层
	        .img-li-b--layer {
	            position: absolute;
	            left: 0;
	            right: 0;
	            top: 0;
	            height: 200px;
	            color: #fff;
	            text-align: center;
	            z-index: 5;
	            background-color: rgba(0, 0, 0, .4);

	            // 放大按钮
	            i {
	                font-size: 1.6em;
	                margin-top: 80px;
	            }
	        }

	        .img-li-b--delete,
	        .img-li-b--layer {
	            opacity: 0;
	            transition: all .3s;
	        }

	        // 悬浮可见删除 or 放大按钮
	        &:hover {

	            .img-li-b--delete,
	            .img-li-b--layer {
	                opacity: 1;
	            }
	        }

	        // 上传进度
	        &.img-li-b--progress {
	            text-align: center;
	            padding-top: 50px;
	        }

	    }
        // 上传按钮
        .img-li-b--upload {
            float: left;
            width: 200px;
            height: 270px;
            display: table;
            text-align: center;

            .img-li-b--upl--field {
                width: 100%;
                display: table-cell;
                vertical-align: middle;
            }
        }
	}
</style>