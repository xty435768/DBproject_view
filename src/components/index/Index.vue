<template>
  <div>
    Index Test
    <el-button @click="handleClick">download test</el-button>
  </div>
</template>
<script>
export default {
  name: 'Index',
  data () {
    return {

    }
  },
  methods: {
    handleClick () {
      console.log('click!');
      // this.$axios
      //   .post('/download', {})
      //   .then((res) => { // 处理返回的文件流
      //             let blob = new Blob([res.data], {type: 'blob'})
      //             const fileName = 'ProductTemplateCopy.xlsx';
      //             let downloadElement = document.createElement('a')
      //             let href = window.URL.createObjectURL(blob); //创建下载的链接
      //             downloadElement.href = href;
      //             downloadElement.download = fileName; //下载后文件名
      //             document.body.appendChild(downloadElement);
      //             downloadElement.click(); //点击下载
      //             document.body.removeChild(downloadElement); //下载完成移除元素
      //             window.URL.revokeObjectURL(href); //释放blob
      //             message.success('upload successfully.');
      //     })
      //     .catch(function (error) {
      //         console.log(error);
      //     });
    //   this.$axios.post('/download', {
    //     responseType: 'blob' //指定返回数据的格式为blob
    //   })
    //     .then(response => {
    //       console.log(response);//把response打出来，看下图
    //       let url = window.URL.createObjectURL(response.data);
    //       console.log(url)
    //       var a = document.createElement("a");
    //       document.body.appendChild(a);
    //       a.href = url;
    //       a.download = '2.xls';
    //       a.click();
    //       window.URL.revokeObjectURL(url);
    //     })
    //     .catch(err => {
    //       console.log(`接口调用失败`);

    //       console.log(err);
    //     })
    }
  }

}
</script>