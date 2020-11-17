<template>
  <div id="app">
    <router-view>
    </router-view>
  </div>
</template>
<script>
export default {
  methods: {
    startHacking () {
      this.$axios.get('/hello').then(response => {
                    if (response.data) {
                        console.log(response.data)
                        this.$notify(
                          {
                            title: 'It Works!',
                            message: response.data
                          }
                        )
                    }
                }).catch(err => {
                    alert('')
                })
      // this.$api
      //     .get('/hello')
      //     .then(successResponse => {
      //       if (successResponse.data.code === 200) {
              
      //       }
      //     })
      //     .catch(failResponse => {
      //       this.$notify({
      //             title: '退钱!',
      //             type: 'failed',
      //             message: failResponse.code,
      //             duration: 5000
      //           })
      //     })
    }
    
  }
}
</script>

<style>
#app {
  font-family: Helvetica, sans-serif;
  text-align: center;
}
</style>
