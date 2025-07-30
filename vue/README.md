# 图书管理系统前端

本项目为图书管理系统的前端部分，基于 Vue3 + Element Plus + JavaScript 实现，配色风格为莫奈印象主义（柔和蓝绿粉紫米色，整体舒适）。

## 目录结构

```
vue/
  ├── src/
  │   ├── assets/           # 静态资源
  │   ├── components/       # 公共组件
  │   ├── views/            # 页面模块
  │   │   ├── Dashboard.vue # 仪表盘
  │   │   ├── Books.vue     # 图书管理
  │   │   ├── Borrow.vue    # 借阅管理
  │   │   ├── Users.vue     # 用户管理
  │   │   └── Login.vue     # 登录
  │   ├── App.vue           # 应用主入口
  │   ├── main.js           # 入口文件，路由/Element Plus配置
  │   └── style.css         # 全局样式（莫奈配色）
  ├── public/               # 公共资源
  ├── package.json          # 依赖配置
  └── vite.config.js        # Vite配置
```

## 依赖安装

```bash
cd vue
npm install
```

## 启动项目

```bash
npm run dev
```

## 页面功能模块

- **仪表盘**：统计图书总数、借出数、用户数等信息
- **图书管理**：图书列表展示、增删改查、搜索
- **借阅管理**：借阅记录展示、借书、还书操作
- **用户管理**：用户列表展示、增删改查
- **登录**：用户登录页面

## 配色风格

- 主色调：柔和蓝、绿、粉、紫、米色，整体舒适，参考莫奈印象主义
- 主要样式在 `src/style.css`，可根据需要调整

## 说明

- 前端通过 axios 请求后端接口（需配合 node 目录下后端服务）
- 如需扩展功能（如权限、统计图表等），可在 views 目录下新增页面

---

