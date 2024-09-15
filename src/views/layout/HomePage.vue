<script setup>
import { ref, onMounted } from 'vue'
import slideShow1 from '@/assets/img/slideShow1.png'
import slideShow2 from '@/assets/img/slideShow2.png'
import slideShow3 from '@/assets/img/slideShow3.jpg'
import noPic from '@/assets/img/noPic.png'

//搜索值
const value = ref('')
//轮播图
const active = ref(0)
//下拉刷新
const isLoading = ref(false)
const onRefresh = () => {
  setTimeout(() => {
    isLoading.value = false
    console.log('success')
  }, 1000)
}
//列表
let count = ref(5)
const loading = ref(false)
const finished = ref(false)

// 推荐列表
const recommendItems = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://dev.bit101.flwfdd.xyz:8081/goods')
    recommendItems.value = await response.json()
  } catch (error) {
    console.error('Error fetching recommendList:', error)
  }
})

// 事务求助列表
const issueItems = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://dev.bit101.flwfdd.xyz:8081/goods')
    const items = await response.json()
    issueItems.value = items.filter((item) => item.type === 1)
  } catch (error) {
    console.error('Error fetching issueList:', error)
  }
})

// 二手交易列表
const transactionItems = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://dev.bit101.flwfdd.xyz:8081/goods')
    const items = await response.json()
    transactionItems.value = items.filter((item) => item.type === 2)
  } catch (error) {
    console.error('Error fetching transactionList:', error)
  }
})

// 活动招聘列表
const recruitmentItems = ref([])

onMounted(async () => {
  try {
    const response = await fetch('http://dev.bit101.flwfdd.xyz:8081/goods')
    const items = await response.json()
    recruitmentItems.value = items.filter((item) => item.type === 3)
  } catch (error) {
    console.error('Error fetching recruitmentList:', error)
  }
})

const onLoad = () => {
  // 异步更新数据
  // setTimeout 仅做示例，真实场景中一般为 ajax 请求
  setTimeout(() => {
    count.value += 5

    // 加载状态结束
    loading.value = false

    // 数据全部加载完成
    if (count.value >= 40) {
      finished.value = true
    }
  }, 1000)
}
</script>

<template>
  <div>
    <van-sticky>
      <van-search
        v-model="value"
        shape="round"
        show-action
        action-text="搜索"
        background="#4fc08d"
        placeholder="请输入搜索关键词"
        @search="$router.push('/search')"
        @cancel="$router.push('/search')"
      />
    </van-sticky>
    <van-tabs v-model:active="active" offset-top="54px" sticky lazy-render>
      <van-tab title="推荐">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <img :src="slideShow1" alt="Slide 1" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow2" alt="Slide 2" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow3" alt="Slide 3" class="swipe-image" />
          </van-swipe-item>
        </van-swipe>
        <van-pull-refresh
          v-model="isLoading"
          success-text="刷新成功"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <span v-for="item in recommendItems.slice(0, count)" :key="item.id">
              <van-swipe-cell>
                <van-card
                  class="goods-card"
                  :num="item.num"
                  :price="item.price.toFixed(2)"
                  :title="item.title"
                  :desc="item.intro"
                  :thumb="
                    item.images.length > 0 ? item.images[0]?.low_url : noPic
                  "
                  @click="
                    $router.push({ name: 'Product', params: { id: item.id } })
                  "
                >
                  <template #tags>
                    <div class="time-container">
                      <van-icon name="notes-o" :size="`${3.5}vw`" />
                      <div>
                        发布时间
                        {{
                          new Date(item.time).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }) +
                          ' ' +
                          new Date(item.time).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        }}
                      </div>
                    </div>
                  </template>
                </van-card>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </span>
          </van-list>
        </van-pull-refresh>
        <van-back-top right="10vw" bottom="12vh" />
      </van-tab>
      <van-tab title="事务求助">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <img :src="slideShow1" alt="Slide 1" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow2" alt="Slide 2" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow3" alt="Slide 3" class="swipe-image" />
          </van-swipe-item>
        </van-swipe>
        <van-pull-refresh
          v-model="isLoading"
          success-text="刷新成功"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <span v-for="item in issueItems.slice(0, count)" :key="item.id">
              <van-swipe-cell>
                <van-card
                  class="goods-card"
                  :num="item.num"
                  :price="item.price.toFixed(2)"
                  :title="item.title"
                  :desc="item.intro"
                  :thumb="
                    item.images.length > 0 ? item.images[0]?.low_url : noPic
                  "
                  @click="$router.push('/product')"
                >
                  <template #tags>
                    <div class="time-container">
                      <van-icon name="notes-o" :size="`${3.5}vw`" />
                      <div>
                        发布时间
                        {{
                          new Date(item.time).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }) +
                          ' ' +
                          new Date(item.time).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        }}
                      </div>
                    </div>
                  </template>
                </van-card>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </span>
          </van-list>
        </van-pull-refresh>
        <van-back-top right="10vw" bottom="12vh" />
      </van-tab>
      <van-tab title="二手交易">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <img :src="slideShow1" alt="Slide 1" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow2" alt="Slide 2" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow3" alt="Slide 3" class="swipe-image" />
          </van-swipe-item>
        </van-swipe>
        <van-pull-refresh
          v-model="isLoading"
          success-text="刷新成功"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <span
              v-for="item in transactionItems.slice(0, count)"
              :key="item.id"
            >
              <van-swipe-cell>
                <van-card
                  class="goods-card"
                  :num="item.num"
                  :price="item.price.toFixed(2)"
                  :title="item.title"
                  :desc="item.intro"
                  :thumb="
                    item.images.length > 0 ? item.images[0]?.low_url : noPic
                  "
                  @click="$router.push('/product')"
                >
                  <template #tags>
                    <div class="time-container">
                      <van-icon name="notes-o" :size="`${3.5}vw`" />
                      <div>
                        发布时间
                        {{
                          new Date(item.time).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }) +
                          ' ' +
                          new Date(item.time).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        }}
                      </div>
                    </div>
                  </template>
                </van-card>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </span>
          </van-list>
        </van-pull-refresh>
        <van-back-top right="10vw" bottom="12vh" />
      </van-tab>
      <van-tab title="活动招聘">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item>
            <img :src="slideShow1" alt="Slide 1" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow2" alt="Slide 2" class="swipe-image" />
          </van-swipe-item>
          <van-swipe-item>
            <img :src="slideShow3" alt="Slide 3" class="swipe-image" />
          </van-swipe-item>
        </van-swipe>
        <van-pull-refresh
          v-model="isLoading"
          success-text="刷新成功"
          @refresh="onRefresh"
        >
          <van-list
            v-model:loading="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <span
              v-for="item in recruitmentItems.slice(0, count)"
              :key="item.id"
            >
              <van-swipe-cell>
                <van-card
                  class="goods-card"
                  :num="item.num"
                  :price="item.price.toFixed(2)"
                  :title="item.title"
                  :desc="item.intro"
                  :thumb="
                    item.images.length > 0 ? item.images[0]?.low_url : noPic
                  "
                  @click="$router.push('/product')"
                >
                  <template #tags>
                    <div class="time-container">
                      <van-icon name="notes-o" :size="`${3.5}vw`" />
                      <div>
                        发布时间
                        {{
                          new Date(item.time).toLocaleDateString('zh-CN', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit'
                          }) +
                          ' ' +
                          new Date(item.time).toLocaleTimeString('zh-CN', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })
                        }}
                      </div>
                    </div>
                  </template>
                </van-card>
                <template #right>
                  <van-button
                    square
                    text="删除"
                    type="danger"
                    class="delete-button"
                  />
                </template>
              </van-swipe-cell>
            </span>
          </van-list>
        </van-pull-refresh>
        <van-back-top right="10vw" bottom="12vh" />
      </van-tab>
    </van-tabs>
  </div>
</template>

<style lang="less" scoped>
//搜索
.search {
  position: sticky;
  top: 0;
  z-index: 999;
}
// 轮播
.my-swipe {
  width: 100%;
  height: 40vw;
}
.my-swipe .van-swipe-item {
  color: #fff;
  font-size: 20px;
  text-align: center;
  background-color: #ffffff;
}
.swipe-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
// 商品
.goods-card {
  width: 101vw;
  margin: 0;
}
// 侧边按钮
.delete-button {
  height: 100%;
}
// 发布时间
.time-container {
  display: flex;
  align-items: center;
  color: #999;
}
</style>
