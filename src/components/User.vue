<template>
  <div
    id="magicalDragScene"
    class="mc-root mc-ui-absolute-pane"
  >
    <el-row
      style="position: absolute; left: 10%; top: 13.5714%; width: 90%; height: 580px;"
      v-if="true"
    >
      <el-col
        style="width: 15%; height: 548px;"
        :xs="24"
        :md="12"
      >
        <el-menu
          mode="vertical"
          @select="handleSelect"
          router
        >
          <el-menu-item index="/user/info">个人信息</el-menu-item>
          <el-menu-item index="/user/cart" v-if="isUser">购物车</el-menu-item>
          <el-menu-item index="/user/orders" v-if="isUser">我的订单</el-menu-item>
          <el-menu-item index="/user/items" v-if="isUser">我发布的商品</el-menu-item>
          <el-menu-item index="/user/selling" v-if="isUser">我卖出的商品</el-menu-item>
          <el-menu-item style="left: 0px;" index="/user/pwd">密码修改</el-menu-item>
        </el-menu>
      </el-col>
      <el-col
        style="width: 80%; height: 548px;"
        :xs="24"
        :md="12"
      >
        <div>
          <router-view>

          </router-view>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "User",
  data () {
    return {
      active: 0,
      isUser: false,

    }
  },
  methods: {
    handleSelect: function (index, indexPath) {
      console.log()
      this.active = index;
      console.log(this.active)
    },
    handleOpen (key, keyPath) {
      console.log(key, keyPath);
    },
    handleClose (key, keyPath) {
      console.log(key, keyPath);
    }
  },
  mounted () {
    //alert("点击左侧菜单更改用户信息！")
    if(window.sessionStorage.getItem('user_type') === 'user'){
      this.isUser = true;
    }
  }
}
</script>
<style scoped>
.username_style {
  margin: 0px auto 22px auto;
}
</style>