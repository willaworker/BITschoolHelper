<script setup></script>

<template>
  <div>
    <router-view />
    <div class="tabber">
      <van-tabbar route>
        <van-tabbar-item replace to="/layout/home" icon="home-o"
          >主页</van-tabbar-item
        >
        <van-tabbar-item replace to="/layout/message" icon="chat-o"
          >消息</van-tabbar-item
        >
        <van-tabbar-item replace to="/layout/post" icon="add-o"
          >发布</van-tabbar-item
        >
        <van-tabbar-item replace to="/layout/order" icon="cart-o"
          >订单</van-tabbar-item
        >
        <van-tabbar-item replace to="/layout/user" icon="user-circle-o"
          >我的</van-tabbar-item
        >
      </van-tabbar>
    </div>
  </div>
</template>

<style lang="less" scoped>
.tabber {
  height: 50px;
}
</style>
