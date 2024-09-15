<template>
  <div class="wrap">
    <div class="title">
      <div>
        <van-icon
          name="arrow-left"
          size="20"
          style="margin-left: 10px"
          @click="onClickLeft"
        />
      </div>
      <strong>{{ userName }}</strong>
      <div>
        <van-icon
          name="ellipsis"
          size="22"
          style="margin-right: 10px"
          @click="toggleSidebar"
        />
      </div>
    </div>
    <div class="content_box" id="box" ref="scrollBox">
      <div
        :class="item.position == 'left' ? 'userbox2' : 'userbox'"
        v-for="(item, index) in chatList"
        :key="index"
      >
        <div :class="item.position == 'left' ? 'nameInfo2' : 'nameInfo'">
          <div style="font-size: 14px">{{ item.username }}</div>
          <div
            :class="item.position == 'left' ? 'contentText2' : 'contentText'"
          >
            {{ item.content }}
          </div>
        </div>
        <div>
          <van-image round width="50px" height="50px" :src="item.url" />
        </div>
      </div>
    </div>
    <div class="bottom">
      <van-field
        v-model="inputValue"
        center
        type="textarea"
        :autosize="{ maxHeight: 100, minHeight: 25 }"
        placeholder="请输入内容"
        rows="1"
      >
        <template #button>
          <van-button size="small" type="primary" @click="sendOut">发送</van-button>
        </template>
      </van-field>
    </div>
    <div v-if="showSidebar" class="sidebar">
      <div class="sidebar-header">
        <span>好友列表</span>
        <van-icon name="close" size="20" @click="toggleSidebar"/>
      </div>
      <div class="friend-list">
        <div class="friend-item" v-for="friend in friendsList" :key="friend.name" @click="selectFriend(friend)">
          <van-image round width="40px" height="40px" :src="friend.avatar" />
          <span>{{ friend.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import userPic1 from '@/assets/img/userPic1.jpg';
import userPic2 from '@/assets/img/userPic2.jpeg';
import userPic3 from '@/assets/img/userPic3.jpg'
import userPic4 from '@/assets/img/userPic4.jpg'
import userPic5 from '@/assets/img/userPic5.jpg'
import userPic6 from '@/assets/img/userPic6.jpg'
import userPic7 from '@/assets/img/userPic7.jpeg'
import userPic8 from '@/assets/img/userPic8.jpg'
import userPic9 from '@/assets/img/userPic9.png'
import userPic10 from '@/assets/img/userPic10.jpg'
import { ref } from 'vue';
import { useRoute } from 'vue-router';

//const route = useRoute();
//const oppositeID = route.params.id;
const fakeCookie = localStorage.getItem('fake-cookie') || '';
export default {
  data() {
    return {
      chatList: [],
      userName: "Alice",
      inputValue: "",
      friendsList: [
        { name: "Alice", avatar: userPic2 },
        { name: "Bob", avatar: userPic3 },
        { name: "Charlie", avatar: userPic4 },
        // 其他好友数据
      ],
      //TODO
      fakeCookie: localStorage.getItem('fake-cookie'),
      showSidebar: false
    };
  },
  mounted() {
    this.scrollToBottom();
    this.fetchAndTransformData()
  },
  methods: {
    toggleSidebar() {
      this.showSidebar = !this.showSidebar;
    },
    onClickLeft() {
      this.$router.back();
    },
    onClickRight() {
      console.log("按钮");
    },
    scrollToBottom() {
      this.$nextTick(() => {
        const scrollBox = this.$refs.scrollBox;
        scrollBox.scrollTop = scrollBox.scrollHeight;
      });
    },
    async sendOut() {
      if (this.inputValue.trim() !== "") {
        const newMessage = {
          url: userPic1,
          username: "我",
          content: this.inputValue.trim(),
          position: "right"
        };
        this.chatList.push(newMessage);
        this.inputValue = "";
        this.scrollToBottom();
        // 发送请求到API
        try {
          const response = await fetch(`http://dev.bit101.flwfdd.xyz:8081/chats/${this.oppositeID}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Fake-cookie': fakeCookie
            },
            body: JSON.stringify({
              content: newMessage.content,
              type: "1"
            })
          });

          const responseData = await response.json();
          console.log('发送成功', responseData);
        } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
        }

        this.inputValue = "";
      }
    },
    selectFriend(friend) {
      this.userName = friend.name;
      this.chatList.forEach(message => {
        if (message.position === 'left') {
          message.username = friend.name;
          message.url = friend.avatar;
        }
      });
      this.showSidebar = false;
    },
    async fetchAndTransformData() {
      try {
        const response = await fetch(`http://dev.bit101.flwfdd.xyz:8081/chats/${this.oppositeID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Fake-cookie' : this.fakeCookie
          },
        });

        const data = await response.json();

        const transformedChatList = data.map(item => {
          return {
            url: item.sender.avatar,
            username: item.sender.nickname,
            content: item.content,
            position: item.sender.id === this.oppositeID ? 'left' : 'right',
          };
        });

        this.chatList = transformedChatList;
      } catch (error) {
        console.error('Error', error);
      }
    }
  }
};
</script>

<style scoped>
html, body {
  overflow: hidden;
  height: 100%;
  margin: 0;
  padding: 0;
}

.wrap {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.title {
  height: 40px;
  width: 100%;
  background-color: #4fc08d;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.bottom {
  height: 70px;
  width: 100%;
  border-top: 1px solid #eaeaea;
  background-color: white;
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 10px;
  box-sizing: border-box;
  z-index: 100;
}

.content_box {
  flex: 1;
  overflow: auto;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 70px; /* 给内容区预留空间，避免被底部输入框覆盖 */
}

.timer {
  text-align: center;
  color: #c2c2c2;
}

.userbox {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}

.nameInfo {
  flex: 1;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.contentText {
  background-color: #39a9ed;
  display: inline-block;
  border-top-left-radius: 10px;
  border-top-right-radius: 0px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  max-width: 61%;
  padding: 5px 10px;
  white-space: normal;
  word-break: break-all;
  margin-top: 3px;
  font-size: 14px;
}

.userbox2 {
  width: 100%;
  display: flex;
  flex-direction: row-reverse;
  margin-bottom: 10px;
}

.nameInfo2 {
  flex: 1;
  margin-left: 10px;
}

.contentText2 {
  background-color: #e4e7e9;
  display: inline-block;
  border-top-left-radius: 0px;
  border-top-right-radius: 10px;
  border-bottom-right-radius: 10px;
  border-bottom-left-radius: 10px;
  max-width: 61%;
  padding: 5px 10px;
  white-space: normal;
  word-break: break-all;
  margin-top: 3px;
  font-size: 14px;
}

.sidebar {
  position: absolute;
  top: 0;
  right: 0;
  width: 250px;
  height: 100%;
  background-color: white;
  box-shadow: 2px 0 5px rgba(0,0,0,0.3);
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #4fc08d;
  color: black;
}

.friend-list {
  flex: 1;
  overflow: auto;
  padding: 10px;
}

.friend-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  cursor: pointer;
}

.friend-item img {
  margin-right: 10px;
}
</style>
