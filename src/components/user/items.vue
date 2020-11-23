<!-- <template>
    <div>
        <h1>
            这里显示用户发布的商品
        </h1>
    </div>
</template> -->
<template>
  <div>
    <Books books class="books-area" ref="booksArea"></Books>
    

  </div>
</template>

<script>
import Books from './Books'
export default {
  name: 'info',
  components: {
    Books,
  },
//   methods:{
//       selectUserBook(uid){
//           this.$axios.post('/student/get_release',{
//               uid:this.$refs.bookArea.uid
//           })
//           .then((resp)=>{
//             if (resp && resp.status === 200) {
//                 this.$refs.booksArea.books = resp.data;
//                 //this.$bus.emit("changeCurrentPage",1);
//             }
//           })
//       }
//   }
  // methods:{
  //     selectByIndexAndUid(index,uid){
  //         this.$axios.post('categories/uid/UserBooks',{
  //             cid:index,
  //             uid:this.$refs.booksArea.uid,
  //         })
  //             .then((resp)=>{
  //                 if (resp && resp.status === 200) {
  //                     this.$refs.booksArea.books = resp.data;
  //                     //改变范围后，将页面回到第一页
  //                     this.$bus.emit("changeCurrentPage",1);
  //                 }
  //         })
  //     }
  // }
}
</script>
