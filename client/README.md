# 智慧医院挂号预约系统

一个基于UniApp + Vue3 + TypeScript开发的医院挂号预约系统客户端。

## 项目简介

本项目是智慧医院挂号预约系统的前端应用，支持多端部署（H5、微信小程序、Android、iOS），为用户提供便捷的在线预约挂号服务。

## 技术栈

- 框架: UniApp + Vue 3
- 语言: TypeScript
- 状态管理: Pinia
- UI组件: 自定义组件
- 样式: SCSS
- 构建工具: Vite

## 功能模块

- 用户认证: 登录、注册
- 科室管理: 科室列表、科室详情
- 医生管理: 医生列表、医生详情
- 预约管理: 创建预约、预约列表、预约详情、取消预约
- 个人中心: 个人信息查看、修改

## 项目结构

```
src/
├── api/              # API接口
├── components/       # 组件
├── pages/           # 页面
├── store/           # 状态管理
├── utils/           # 工具函数
├── styles/          # 样式文件
├── types/           # 类型定义
└── static/          # 静态资源
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 开发模式

```bash
# H5
npm run dev:h5

# 微信小程序
npm run dev:mp-weixin

# App
npm run dev:app
```

### 生产构建

```bash
# H5
npm run build:h5

# 微信小程序
npm run build:mp-weixin

# App
npm run build:app
```

## 文档

完整文档请查看 [docs](./docs) 目录。

## 许可证

MIT
