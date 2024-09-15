import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import pinia from './stores/index'
import '@/assets/main.scss'
//vant插件
import {
  NavBar,
  Search,
  Toast,
  Swipe,
  SwipeItem,
  Tab,
  Tabs,
  Card,
  Sticky,
  Tabbar,
  TabbarItem,
  Lazyload
} from 'vant'
import 'vant/lib/index.css'

const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

app.use(NavBar)
app.use(Search)
app.use(Toast)
app.use(Swipe)
app.use(SwipeItem)
app.use(Tab)
app.use(Tabs)
app.use(Card)
app.use(Sticky)
app.use(Tabbar)
app.use(TabbarItem)
app.use(Lazyload, {
  lazyComponent: true
})
