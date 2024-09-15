<template>
  <div class="order-box">
    <div class="order-header">
      <span class="order-name">我的订单</span>
    </div>
    <van-tabs
      :color="'#1baeae'"
      :title-active-color="'#1baeae'"
      class="order-tab"
      v-model="state.status"
      @change="onChangeTab"
    >
      <van-tab title="进行中" name="1"></van-tab>
      <van-tab title="已完成" name="2"></van-tab>
      <van-tab title="已撤销" name="3"></van-tab>
      <van-tab title="全部" name="0"></van-tab>
    </van-tabs>
    <div class="content">
      <van-pull-refresh
        v-model="state.refreshing"
        @refresh="onRefresh"
        class="order-list-refresh"
      >
        <van-list
          v-model:loading="state.loading"
          :finished="state.finished"
          finished-text="没有更多了"
          @load="onLoad"
          :offset="10"
        >
          <div
            v-for="(item, index) in filteredList"
            :key="index"
            class="order-item-box"
          >
            <div class="order-item-header">
              <span>{{ getTagName(item.type) }}</span>
            </div>
            <div class="order-item-content" @click="goTo(item.orderid)">
              <img
                class="order-item-image"
                :src="item.image"
                alt="商品图片"
              />
              <div class="order-item-info">
                <div class="order-item-title">{{ item.title }}</div>
                <div class="order-item-details">
                  购买数量: {{ item.num }} 价格: {{ item.price }}
                </div>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
  </div>
  <van-dialog
    v-model:show="showRating"
    title="请评价"
    show-cancel-button
    show-confirm-button
    @confirm="onRateConfirm"
  >
    <van-rate v-model="rating" />
  </van-dialog>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const fakeCookie = localStorage.getItem('fake-cookie') || ''

class Goods {
  constructor(orderid, id, intro, num, price, time, title, type, user, image) {
    this.orderid = orderid
    this.id = id
    this.intro = intro
    this.num = num
    this.price = price
    this.time = time
    this.title = title
    this.type = type
    this.user = user
    this.image = image
  }
}

const router = useRouter()
const state = reactive({
  status: '1',
  loading: false,
  finished: false,
  refreshing: false,
  list: [],
  page: 1,
  totalPage: 1 // 假设总页数为 1，需根据实际情况调整
})
const filteredList = ref([])

const loadData = async (status) => {
  state.loading = true

  try {
    const response = await fetch(`http://dev.bit101.flwfdd.xyz:8081/orders?state=${status}&page=${state.page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Fake-Cookie': fakeCookie,
      }
    })
    const data = await response.json()
    //const data = test
  
    // 解析响应数据
    const statusMap = {
      1: [],
      2: [],
      3: [],
      0: []
    }

    data.forEach((item) => {
      const goods = new Goods(
        item.id,
        item.goods.id,
        item.goods.intro,
        item.goods.num,
        item.goods.price,
        item.goods.time,
        item.goods.title,
        item.goods.type,
        item.goods.user,
        item.goods.images[0].low_url
      )

      statusMap[item.state].push(goods)
      statusMap[0].push(goods) // 将所有状态的商品也添加到状态0中
    })

    state.list = statusMap[status] || []
    filteredList.value = state.list // 更新列表

    state.loading = false
    if (state.page >= state.totalPage) {
      state.finished = true
    }
  } catch (error) {
    console.error('加载数据失败:', error)
    state.loading = false
  }
}

const onChangeTab = (name) => {
  state.loading = true
  state.finished = false // 重置完成状态
  state.page = 1 // 重置页数
  loadData(name)
}

const goTo = (id) => {
  router.push({ path: '/order', query: { id } })
}

const onLoad = () => {
  if (state.page < state.totalPage) {
    state.page += 1
    loadData(state.status)
  }
}

const onRefresh = () => {
  state.refreshing = true
  state.finished = false
  state.loading = true
  state.page = 1
  loadData(state.status).then(() => {
    state.refreshing = false
  })
}

const getTagName = (type) => {
  switch (type) {
    case 1:
      return '事务求助'
    case 2:
      return '二手交易'
    case 3:
      return '活动招募'
    default:
      return ''
  }
}

onMounted(() => {
  loadData(state.status)
})
</script>

<style lang="less" scoped>
.order-box {
  .order-header {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 10000;
    width: 100%;
    height: 44px;
    line-height: 44px;
    padding: 0 10px;
    box-sizing: border-box;
    color: #252525;
    background: #fff;
    border-bottom: 1px solid #dcdcdc;
    display: flex;
    align-items: center;
    .order-name {
      font-size: 14px;
      flex: 1;
      text-align: center;
    }
  }
  .order-tab {
    position: fixed;
    top: 44px; // 使 tab 紧接 header 下方
    left: 0;
    z-index: 1000;
    width: 100%;
    border-bottom: 1px solid #e9e9e9;
  }
  .skeleton {
    margin-top: 60px;
  }
  .content {
    height: calc(100vh - 88px); // 减去 header 和 tab 的高度
    overflow: hidden;
    overflow-y: scroll;
    margin-top: 88px; // 使内容区域在 header 和 tab 下面
  }
  .order-list-refresh {
    .van-card__content {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    .van-pull-refresh__head {
      background: #f9f9f9;
    }
    .order-item-box {
      margin: 20px 10px;
      background-color: #fff;
      border: 1px solid #dcdcdc;
      .order-item-header {
        padding: 10px;
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid #e9e9e9;
        background-color: #f7f7f7;
      }
      .order-item-content {
        display: flex;
        padding: 10px;
      }
      .order-item-image {
        width: 100px;
        height: 100px;
        margin-right: 10px;
        background-color: #e9e9e9;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .order-item-info {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
      .order-item-title {
        font-size: 16px;
        font-weight: bold;
      }
      .order-item-details {
        margin-top: 5px;
        color: #999;
      }
      // .order-item-buttons {
      //   display: flex;
      //   justify-content: flex-start;
      //   gap: 10px;
      //   margin-top: 10px;
      // }
    }
  }
}
</style>
