<template>
  <div class="order-detail-box">
    <div class="order-header">
      <span @click="goBack" class="back-icon">&lt;</span>
      <span class="order-title">订单详情</span>
    </div>
    <div class="order-tabs">
      <van-tabs v-model="active" type="card">
        <van-tab :title="getStatueName(order.state)" name="1"></van-tab>
      </van-tabs>
    </div>
    <div class="order-content">
      <div class="order-info">
        <div class="order-image">
          <img
            :src="
              order?.goods?.images && order?.goods?.images?.length > 0
                ? order?.goods?.images[0].url
                : noPic
            "
            alt="商品图片"
          />
        </div>
        <div class="order-details">
          <p><strong>商品名称:</strong> {{ order.goods?.title }}</p>
          <p><strong>商品描述信息:</strong> {{ order.goods?.intro }}</p>
          <p><strong>总价格:</strong> {{ order.goods?.price }}</p>
        </div>
      </div>
      <div class="order-meta">
        <p><strong>订单编号:</strong> {{ order.id }}</p>
        <p><strong>订单类型:</strong> {{ getTagName(order.goods?.type) }}</p>
        <p>
          <strong>订单创建时间:</strong>
          {{
            new Date(order.time).toLocaleDateString('zh-CN', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit'
            }) +
            ' ' +
            new Date(order.time).toLocaleTimeString('zh-CN', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })
          }}
        </p>
        <p><strong>发布用户:</strong> {{ order.goods?.user?.nickname }}</p>
        <p><strong>接受用户:</strong> 我</p>
      </div>
      <div class="order-actions">
        <van-button
          type="primary"
          size="small"
          @click="contactUser(order.goods?.user?.id)"
          >联系对方</van-button
        >
        <van-button type="success" size="small" @click="confirmOrder(order.id)"
          >确认完成</van-button
        >
        <van-button type="danger" size="small" @click="cancelOrder(order.id)"
          >取消订单</van-button
        >
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
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import noPic from '@/assets/img/noPic.png'

const router = useRouter()
const route = useRoute()
const order = ref('')

const fakeCookie = localStorage.getItem('fake-cookie') || ''

const fetchOrderDetail = (orderID) => {
  var myHeaders = new Headers()
  myHeaders.append('User-Agent', 'Apifox/1.0.0 (https://apifox.com)')
  myHeaders.append('Fake-Cookie', fakeCookie)

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  }

  fetch(`http://dev.bit101.flwfdd.xyz:8081/orders/${orderID}`, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      order.value = data
      console.log(data)
    })
    .catch((error) => console.log('error', error))
}

const updateOrderState = async (orderID, newState) => {
  //TODO if
  try {
    const response = await fetch(
      `http://dev.bit101.flwfdd.xyz:8081/orders/${orderID}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Fake-Cookie': fakeCookie
        },
        body: JSON.stringify({
          state: newState
        })
      }
    )

    if (response.ok) {
      const data = await response.json()
      console.log('订单状态更新成功:', data)
      return data
    } else {
      throw new Error('订单状态更新失败')
    }
  } catch (error) {
    console.error('更新订单状态时发生错误:', error)
    throw error
  }
}

const goBack = () => {
  router.back()
}

const contactUser = (id) => {
  router.push({ path: '../layout/message', query: { id } })
}

const confirmOrder = (orderID) => {
  updateOrderState(orderID, 2)
  goTo(orderID)
}

const cancelOrder = (orderID) => {
  updateOrderState(orderID, 3)
  router.push('/layout/order')
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
      return '其他类型'
  }
}

const getStatueName = (type) => {
  switch (type) {
    case 1:
      return '进行中'
    case 2:
      return '完成'
    case 3:
      return '撤销'
    default:
      return '其他类型'
  }
}

const goTo = (id) => {
  router.push({ path: '/comment', query: { id } })
}

onMounted(() => {
  const orderID = route.query.id
  fetchOrderDetail(orderID)
})
</script>

<style scoped>
.order-detail-box {
  padding: 16px;
  .order-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    .back-icon {
      cursor: pointer;
    }
    .order-title {
      flex: 1;
      text-align: center;
      font-size: 18px;
    }
  }
  .order-tabs {
    margin-bottom: 16px;
  }
  .order-content {
    font-size: 14px;
    .order-info {
      display: flex;
      margin-bottom: 16px;
      .order-image {
        width: 100px;
        height: 100px;
        background-color: #f9f9f9;
        display: flex;
        justify-content: center;
        align-items: center;
        img {
          max-width: 100%;
          max-height: 100%;
        }
      }
      .order-details {
        flex: 1;
        margin-left: 16px;
        p {
          margin: 8px 0;
        }
      }
    }
    .order-meta {
      p {
        margin: 8px 0;
      }
    }
    .order-actions {
      display: flex;
      justify-content: space-between;
      button {
        flex: 1;
        margin: 0 8px;
      }
    }
  }
}
</style>
