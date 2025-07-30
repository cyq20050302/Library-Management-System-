import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.css'
import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from './views/Dashboard.vue'
import Books from './views/Books.vue'
import Borrow from './views/Borrow.vue'
import Users from './views/Users.vue'
import Login from './views/Login.vue'
import Register from './views/Register.vue'

const app = createApp(App)
app.use(ElementPlus)

const routes = [
  { path: '/', redirect: '/dashboard' },
  { path: '/dashboard', component: Dashboard },
  { path: '/books', component: Books },
  { path: '/borrow', component: Borrow },
  { path: '/users', component: Users },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
]
const router = createRouter({
  history: createWebHistory(),
  routes,
})

app.use(router)
app.mount('#app')