<script setup>
import { showToast } from 'vant'
import { ref } from 'vue'
import 'vant/es/toast/style'

const fakeCookie = localStorage.getItem('fake-cookie') || ''

// 发布按钮
const onClickRight = () => {
  const imageMids = fileList.value.map((file) => file.mid)

  const payload = {
    type: parseInt(checked.value),
    title: title.value,
    intro: description.value,
    num: parseInt(number.value),
    price: parseFloat(price.value),
    image_mids: imageMids
  }

  fetch('http://dev.bit101.flwfdd.xyz:8081/goods', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Fake-Cookie': fakeCookie
    },
    body: JSON.stringify(payload)
  })
    .then((response) => {
      if (response.ok) {
        showToast('发布成功')
        return response.json()
      } else {
        throw new Error('发布失败')
      }
    })
    .catch((error) => {
      console.error('发布失败:', error)
      showToast('发布失败')
    })
}

//上传的图片
const fileList = ref([])

//最大上传大小
const maxSize = ref(500 * 1024)
const onOversize = () => {
  showToast('文件大小不能超过 500kb')
}

//上传图片
const afterRead = (file) => {
  file.status = 'uploading'
  file.message = '上传中...'

  const formData = new FormData()
  formData.append('file', file.file)

  var myHeaders = new Headers()
  myHeaders.append('User-Agent', 'Apifox/1.0.0 (https://apifox.com)')
  myHeaders.append('Fake-Cookie', fakeCookie)

  var formdata = new FormData()
  formdata.append('file', file.file)

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: formdata,
    redirect: 'follow'
  }

  fetch('http://dev.bit101.flwfdd.xyz:8081/upload/image', requestOptions)
    .then((response) => response.json())
    .then((data) => {
      const updatedFileList = fileList.value.map((f) => {
        if (f.file === file.file) {
          return {
            ...f,
            status: 'successed',
            message: '上传成功',
            url: data.url,
            mid: data.mid
          }
        }
        return f
      })
      fileList.value = updatedFileList
      console.log(fileList.value)
    })
    .catch((error) => {
      const updatedFileList = fileList.value.map((f) => {
        if (f.file === file.file) {
          return {
            ...f,
            status: 'failed',
            message: '上传失败'
          }
        }
        return f
      })
      fileList.value = updatedFileList
      console.log('error', error)
    })
}

// 输入的内容
const title = ref(null)
const checked = ref('1')
const price = ref(null)
const number = ref(null)
const description = ref(null)
const address = ref(null)
const name = ref(null)
const telphone = ref(null)

// 验证规则函数
const getRules = (value) => {
  return value ? [] : [{ required: true }]
}

// 格式化器函数
const formatter = (value) => value.replace(/\D/g, '')

// 格式化器函数：允许输入一个小数点，并且最多保留两位小数
const formatter2 = (value) => {
  if (!value) return ''
  // 仅保留第一个小数点，并去掉非数字和非小数点字符
  value = value.replace(/[^0-9.]/g, '')
  // 如果出现多个小数点，则保留第一个，去掉后面的
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts[1]
  }
  // 保留两位小数
  if (parts.length === 2) {
    parts[1] = parts[1].substring(0, 2)
    value = parts[0] + '.' + parts[1]
  }
  return value
}
</script>

<template>
  <div class="post">
    <van-nav-bar
      title="订单发布"
      left-arrow
      @click-left="$router.push('/layout/home')"
      @click-right="onClickRight"
    >
      <template #left>
        <van-icon name="arrow-left" color="#ee0a24" size="18px" />
      </template>
      <template #right>
        <van-button
          color="linear-gradient(to right, #ff6034, #ee0a24)"
          size="small"
          round
          hairline
        >
          发布
        </van-button>
      </template>
    </van-nav-bar>
    <van-cell-group inset class="input">
      <van-form required="auto">
        <van-field
          :rules="getRules(fileList)"
          label="物品图片"
          placeholder="请输入物品图片"
          :clearable="true"
        >
          <template #input>
            <van-uploader
              v-model="fileList"
              multiple
              :after-read="afterRead"
              :max-size="maxSize"
              @oversize="onOversize"
              preview-size="15vw"
            />
          </template>
        </van-field>
        <van-field
          v-model="title"
          :rules="getRules(title)"
          label="标题"
          placeholder="请输入标题"
          :clearable="true"
          type="textarea"
          autosize
          show-word-limit
        />
        <van-field label="订单类别">
          <template #input
            ><van-radio-group v-model="checked" direction="horizontal">
              <van-radio name="1" icon-size="15px" class="radio"
                >事务求助</van-radio
              >
              <van-radio name="2" icon-size="15px" class="radio"
                >二手交易</van-radio
              >
              <van-radio name="3" icon-size="15px" class="radio"
                >活动招聘</van-radio
              >
            </van-radio-group>
          </template>
        </van-field>
        <van-field
          v-model="price"
          :rules="getRules(price)"
          type="number"
          label="价格"
          :formatter="formatter2"
          placeholder="请输入价格"
          :clearable="true"
        />
        <van-field
          v-model="number"
          :rules="getRules(number)"
          type="digit"
          label="物品数量"
          :formatter="formatter"
          placeholder="请输入物品数量"
          :clearable="true"
        />
        <van-field
          v-model="description"
          :rules="getRules(description)"
          type="textarea"
          rows="2"
          maxlength="200"
          label="物品描述"
          placeholder="请输入物品描述"
          :clearable="true"
          autosize
          show-word-limit
        />
        <van-field
          v-model="address"
          :rules="getRules(address)"
          label="地址"
          placeholder="请输入地址"
          :clearable="true"
          type="textarea"
          autosize
          show-word-limit
        />
        <van-field
          v-model="name"
          :rules="getRules(name)"
          label="姓名"
          placeholder="请输入姓名"
          :clearable="true"
        />
        <van-field
          v-model="telphone"
          :rules="getRules(telphone)"
          type="tel"
          label="电话"
          :formatter="formatter"
          placeholder="请输入电话"
          :clearable="true"
        />
      </van-form>
    </van-cell-group>
  </div>
  <div class="fake"></div>
</template>

<style lang="less" scoped>
.post {
  .input {
    margin-top: 10px;
  }
  .radio {
    font-size: var(--van-font-size-sm);
  }
}
.fake {
  background-color: #f5f5f5;
  position: fixed;
  height: 100vh;
  width: 100vw;
  bottom: 0;
  z-index: -1;
}
</style>
