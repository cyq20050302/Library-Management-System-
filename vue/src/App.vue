<script setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Menu, HomeFilled, Notebook, Tickets, User } from '@element-plus/icons-vue';
const $route = useRoute();
const router = useRouter();
const isCollapse = ref(false);

function logout() {
  // 可在此清除本地token等登录状态
  router.push('/login');
}
</script>

<template>
  <router-view v-slot="{ Component }">
    <template v-if="$route.path === '/login' || $route.path === '/register'">
      <component :is="Component" />
    </template>
    <template v-else>
      <el-container class="layout-root">
        <el-aside :width="isCollapse ? '64px' : '200px'" class="layout-aside">
          <div class="aside-title" :class="{ 'aside-title-center': isCollapse }">
            <span v-if="!isCollapse">图书管理系统</span>
            <el-icon v-else><Menu /></el-icon>
          </div>
          <el-menu :router="true" :collapse="isCollapse" default-active="$route.path" background-color="#e6ecef" text-color="#3a3a3a" active-text-color="#8bb8a8" class="aside-menu">
            <el-menu-item index="/dashboard"><el-icon><HomeFilled /></el-icon><span>仪表盘</span></el-menu-item>
            <el-menu-item index="/books"><el-icon><Notebook /></el-icon><span>图书管理</span></el-menu-item>
            <el-menu-item index="/borrow"><el-icon><Tickets /></el-icon><span>借阅管理</span></el-menu-item>
            <el-menu-item index="/users"><el-icon><User /></el-icon><span>用户管理</span></el-menu-item>
          </el-menu>
        </el-aside>
        <el-container style="width: 100%;">
          <el-header class="layout-header">
            <el-button @click="isCollapse = !isCollapse" type="text" class="collapse-btn">
              <el-icon><Menu /></el-icon>
            </el-button>
            <div class="header-user">欢迎您，管理员 <el-button type="text" style="color: #3a3a3a;" @click="logout">退出</el-button></div>
          </el-header>
          <el-main class="layout-main">
            <component :is="Component" />
          </el-main>
        </el-container>
      </el-container>
    </template>
  </router-view>
</template>

<style scoped>
.layout-root {
  min-height: 100vh;
  background: #f7f6f2;
}
.layout-aside {
  background: #e6ecef;
  box-shadow: 2px 0 8px rgba(163,193,218,0.06);
  transition: width 0.2s;
  min-height: 100vh;
}
.aside-title {
  height: 60px;
  display: flex;
  align-items: center;
  font-size: 20px;
  color: #8bb8a8;
  font-weight: bold;
  letter-spacing: 2px;
  padding-left: 24px;
  transition: all 0.2s;
  justify-content: flex-start;
}
.aside-title-center {
  justify-content: center !important;
  padding-left: 0 !important;
}
.aside-menu {
  padding-left: 0;
}
/* 折叠时菜单整体居中 */
:deep(.el-menu--collapse) {
  display: flex !important;
  flex-direction: column;
  align-items: center;
}
:deep(.el-menu--collapse .el-menu-item) {
  justify-content: center !important;
  padding-left: 0 !important;
}
.layout-header {
  background: #b3c7d6;
  color: #3a3a3a;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  box-shadow: 0 2px 8px rgba(163,193,218,0.04);
  padding: 0 24px;
}
.collapse-btn {
  color: #3a3a3a;
  font-size: 20px;
}
.header-user {
  margin-right: 0;
  color: #3a3a3a;
}
.layout-main {
  background: #f7f6f2;
  min-height: calc(100vh - 60px);
  width: 100%;
  padding: 0;
  margin: 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}
.el-menu-item {
  font-size: 16px;
  height: 48px;
  line-height: 48px;
}
</style>
