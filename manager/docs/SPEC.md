# 智慧医院挂号预约系统 - 管理端前端规范

## 1. 项目概述

### 1.1 项目名称
智慧医院挂号预约系统 - 管理端（Smart Hospital Appointment Management System - Admin Portal）

### 1.2 项目定位
为医院管理人员提供全面的预约挂号系统管理功能，包括用户管理、科室管理、医生管理、排班管理、预约管理等核心模块。

### 1.3 技术栈
- **前端框架**: React 19
- **路由**: React Router v6
- **状态管理**: React Context API
- **HTTP客户端**: Fetch API
- **样式**: CSS Modules / 内联样式
- **构建工具**: Vite
- **图标**: Lucide React

---

## 2. 设计规范

### 2.1 色彩系统
| 用途 | 颜色名称 | 色值 | 说明 |
|------|----------|------|------|
| 主色 | Medical Blue | #2563EB | 导航、按钮、主要交互元素 |
| 次色 | Sky Blue | #0EA5E9 | 辅助强调、hover状态 |
| 强调色 | Emerald | #10B981 | 成功状态、确认操作 |
| 警告色 | Amber | #F59E0B | 警告状态、待处理 |
| 危险色 | Red | #EF4444 | 错误、删除、取消 |
| 背景色 | Slate 50 | #F8FAFC | 页面背景 |
| 卡片背景 | White | #FFFFFF | 卡片、表格背景 |
| 文本主色 | Slate 900 | #0F172A | 标题、重要文字 |
| 文本次色 | Slate 600 | #475569 | 辅助说明文字 |
| 边框色 | Slate 200 | #E2E8F0 | 分割线、边框 |

### 2.2 字体系统
- **主字体**: Inter, -apple-system, BlinkMacSystemFont, sans-serif
- **标题字号**:
  - H1: 28px / font-weight: 700
  - H2: 24px / font-weight: 600
  - H3: 20px / font-weight: 600
  - H4: 16px / font-weight: 600
- **正文字号**: 14px / font-weight: 400
- **辅助字号**: 12px / font-weight: 400

### 2.3 间距系统
- **基础单位**: 4px
- **常用间距**: 8px, 12px, 16px, 24px, 32px, 48px
- **卡片内边距**: 24px
- **页面边距**: 24px
- **元素间距**: 16px

### 2.4 圆角规范
- **小圆角**: 6px (按钮、输入框)
- **中圆角**: 8px (卡片、模态框)
- **大圆角**: 12px (大型容器)

### 2.5 阴影规范
- **卡片阴影**: 0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)
- **悬浮阴影**: 0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)
- **模态框阴影**: 0 25px 50px rgba(0,0,0,0.25)

---

## 3. 页面结构与布局

### 3.1 整体布局
```
┌─────────────────────────────────────────────────────────┐
│                    顶部导航栏 (64px)                      │
│  Logo + 系统标题          用户信息 + 退出按钮              │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│  侧边栏   │              主内容区域                       │
│  (240px) │                                              │
│          │  ┌──────────────────────────────────────┐    │
│  - 首页   │  │  页面标题 + 操作按钮                   │    │
│  - 用户   │  ├──────────────────────────────────────┤    │
│  - 科室   │  │                                      │    │
│  - 医生   │  │           内容区域                    │    │
│  - 排班   │  │                                      │    │
│  - 预约   │  │                                      │    │
│  - 统计   │  │                                      │    │
│          │  └──────────────────────────────────────┘    │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### 3.2 响应式断点
- **桌面端**: >= 1024px (完整布局)
- **平板端**: 768px - 1023px (侧边栏可折叠)
- **移动端**: < 768px (汉堡菜单，侧边栏滑出)

---

## 4. 功能模块详细规范

### 4.1 认证模块 (Authentication)

#### 登录页面
- **路径**: `/login`
- **功能**:
  - 用户名/密码输入
  - 登录表单验证
  - 错误提示展示
  - JWT令牌存储到localStorage
- **验证规则**:
  - 用户名: 必填，3-20字符
  - 密码: 必填，最少6字符

#### 认证上下文
- 存储当前用户信息
- 提供登录/登出方法
- 提供token注入到请求头

### 4.2 首页仪表盘 (Dashboard)

#### 页面路径: `/`
#### 展示内容:
1. **统计卡片** (4个):
   - 今日预约数
   - 本周预约数
   - 科室总数
   - 医生总数

2. **快捷操作入口**:
   - 新增用户
   - 新增医生
   - 排班管理
   - 预约查询

3. **近期预约列表**:
   - 显示最近10条预约记录
   - 包含患者姓名、医生、科室、时间、状态

4. **系统状态**:
   - 在线用户数
   - 系统版本信息

### 4.3 用户管理模块 (User Management)

#### 页面路径: `/users`
#### 功能列表:
1. **用户列表**
   - 表格展示: 序号、用户名、姓名、性别、年龄、手机、角色、状态、操作
   - 支持按角色筛选 (全部/管理员/医生/患者)
   - 支持按状态筛选 (全部/启用/禁用)
   - 支持关键字搜索 (用户名、姓名、手机)
   - 分页功能 (每页10条)

2. **新增用户**
   - 模态框表单
   - 字段: 用户名*, 密码*, 姓名*, 性别*, 年龄*, 手机*, 邮箱, 身份证号, 角色*
   - 验证规则:
     - 用户名: 3-20字符，唯一
     - 手机: 11位数字
     - 年龄: 1-150整数
     - 邮箱: 有效邮箱格式

3. **编辑用户**
   - 模态框表单
   - 字段: 姓名, 性别, 年龄, 手机, 邮箱, 身份证号, 状态
   - 不允许修改用户名、密码、角色

4. **删除用户**
   - 确认对话框
   - 显示用户信息预览
   - 危险操作警告

### 4.4 科室管理模块 (Department Management)

#### 页面路径: `/departments`
#### 功能列表:
1. **科室列表**
   - 表格展示: 序号、科室名称、描述、状态、创建时间、操作
   - 支持按状态筛选
   - 支持关键字搜索
   - 分页功能

2. **新增科室**
   - 模态框表单
   - 字段: 科室名称*, 描述, 状态
   - 验证: 科室名称2-30字符，唯一

3. **编辑科室**
   - 模态框表单
   - 字段: 科室名称, 描述, 状态

4. **删除科室**
   - 确认对话框
   - 检查是否有关联医生

### 4.5 医生管理模块 (Doctor Management)

#### 页面路径: `/doctors`
#### 功能列表:
1. **医生列表**
   - 表格展示: 序号、姓名、科室、职称、专长、状态、操作
   - 支持按科室筛选
   - 支持按状态筛选
   - 支持关键字搜索 (姓名、专长)
   - 分页功能

2. **新增医生**
   - 模态框表单
   - 字段: 用户(ID)*, 科室*, 职称*, 专长, 简介, 状态
   - 需要先创建用户并设置为DOCTOR角色

3. **编辑医生**
   - 模态框表单
   - 字段: 科室, 职称, 专长, 简介, 状态

4. **删除医生**
   - 确认对话框
   - 检查是否有相关排班和预约

5. **医生详情** (可选)
   - 侧滑面板或新页面
   - 显示完整医生信息
   - 显示关联排班和预约统计

### 4.6 排班管理模块 (Schedule Management)

#### 页面路径: `/schedules`
#### 功能列表:
1. **排班列表**
   - 表格展示: 序号、医生、科室、日期、时间段、最大人数、已预约、状态、操作
   - 支持按科室筛选
   - 支持按医生筛选
   - 支持按日期筛选 (日期选择器)
   - 支持按状态筛选
   - 分页功能

2. **新增排班**
   - 模态框表单
   - 字段: 医生*, 日期*, 开始时间*, 结束时间*, 最大预约人数*, 状态
   - 验证:
     - 日期不能早于今天
     - 结束时间 > 开始时间
     - 最大人数 > 0

3. **编辑排班**
   - 模态框表单
   - 字段: 开始时间, 结束时间, 最大预约人数, 状态

4. **删除排班**
   - 确认对话框
   - 检查是否有已确认的预约

5. **批量排班** (增强功能)
   - 按周重复创建排班
   - 复制现有排班

### 4.7 预约管理模块 (Appointment Management)

#### 页面路径: `/appointments`
#### 功能列表:
1. **预约列表**
   - 表格展示: 序号、患者姓名、医生、科室、预约时间、状态、症状、操作
   - 支持按状态筛选 (全部/待确认/已确认/已完成/已取消)
   - 支持按科室筛选
   - 支持按医生筛选
   - 支持日期范围筛选
   - 支持关键字搜索 (患者姓名、医生姓名)
   - 分页功能

2. **查看预约详情**
   - 模态框或侧滑面板
   - 完整预约信息展示

3. **确认预约**
   - 状态变更: PENDING -> CONFIRMED
   - 需双重确认

4. **完成预约**
   - 状态变更: CONFIRMED -> COMPLETED
   - 记录完成时间

5. **取消预约**
   - 状态变更: -> CANCELLED
   - 需填写取消原因
   - 释放排班名额

6. **导出功能**
   - 导出Excel格式
   - 按筛选条件导出

### 4.8 统计报表模块 (Statistics)

#### 页面路径: `/statistics`
#### 功能列表:
1. **数据概览**
   - 卡片展示关键指标
   - 今日、本周、本月、本年数据

2. **预约统计**
   - 按日/周/月统计预约数量
   - 柱状图或折线图展示

3. **科室预约分布**
   - 各科室预约占比
   - 饼图展示

4. **医生工作量统计**
   - 各医生预约数量排名
   - 柱状图展示

5. **预约状态分布**
   - 各状态预约数量和占比

6. **时间维度分析**
   - 高峰时段分析
   - 预约取消率分析

---

## 5. 组件规范

### 5.1 通用组件

#### Button (按钮)
```javascript
// Props
type: 'primary' | 'secondary' | 'danger' | 'ghost'
size: 'small' | 'medium' | 'large'
disabled: boolean
loading: boolean
onClick: function
children: ReactNode
```

#### Input (输入框)
```javascript
// Props
type: 'text' | 'password' | 'email' | 'number'
placeholder: string
value: string
onChange: function
error: string
disabled: boolean
```

#### Select (选择器)
```javascript
// Props
options: Array<{value, label}>
value: string
onChange: function
placeholder: string
error: string
```

#### Table (表格)
```javascript
// Props
columns: Array<{title, dataIndex, render, width}>
dataSource: Array
pagination: {page, pageSize, total, onChange}
loading: boolean
onRowClick: function
```

#### Modal (模态框)
```javascript
// Props
visible: boolean
title: string
onCancel: function
onOk: function
width: string | number
children: ReactNode
```

#### Card (卡片)
```javascript
// Props
title: string
extra: ReactNode
children: ReactNode
```

#### StatusBadge (状态徽章)
```javascript
// Props
status: string
```

### 5.2 状态映射

#### 用户状态 (User Status)
- ACTIVE: 绿色徽章 "启用"
- INACTIVE: 灰色徽章 "禁用"

#### 角色 (Role)
- ADMIN: 蓝色徽章 "管理员"
- DOCTOR: 绿色徽章 "医生"
- PATIENT: 灰色徽章 "患者"

#### 预约状态 (Appointment Status)
- PENDING: 黄色徽章 "待确认"
- CONFIRMED: 蓝色徽章 "已确认"
- COMPLETED: 绿色徽章 "已完成"
- CANCELLED: 红色徽章 "已取消"

#### 排班状态 (Schedule Status)
- ACTIVE: 绿色徽章 "正常"
- CANCELLED: 灰色徽章 "已取消"

---

## 6. API 接口映射

### 6.1 基础配置
- **Base URL**: `http://localhost:8080/api/v1`
- **认证头**: `Authorization: Bearer {token}`

### 6.2 接口列表

| 模块 | 接口路径 | 方法 | 功能 |
|------|----------|------|------|
| 认证 | /auth/login | POST | 用户登录 |
| 认证 | /auth/refresh | POST | 刷新令牌 |
| 用户 | /users | GET | 获取用户列表 |
| 用户 | /users/{id} | GET | 获取单个用户 |
| 用户 | /users | POST | 创建用户 |
| 用户 | /users/{id} | PUT | 更新用户 |
| 用户 | /users/{id} | DELETE | 删除用户 |
| 科室 | /departments | GET | 获取科室列表 |
| 科室 | /departments/{id} | GET | 获取单个科室 |
| 科室 | /departments | POST | 创建科室 |
| 科室 | /departments/{id} | PUT | 更新科室 |
| 科室 | /departments/{id} | DELETE | 删除科室 |
| 医生 | /doctors | GET | 获取医生列表 |
| 医生 | /doctors/{id} | GET | 获取单个医生 |
| 医生 | /doctors | POST | 创建医生 |
| 医生 | /doctors/{id} | PUT | 更新医生 |
| 医生 | /doctors/{id} | DELETE | 删除医生 |
| 医生 | /doctors/department/{id} | GET | 按科室获取医生 |
| 排班 | /schedules | GET | 获取排班列表 |
| 排班 | /schedules/{id} | GET | 获取单个排班 |
| 排班 | /schedules | POST | 创建排班 |
| 排班 | /schedules/{id} | PUT | 更新排班 |
| 排班 | /schedules/{id} | DELETE | 删除排班 |
| 排班 | /schedules/doctor/{id} | GET | 按医生获取排班 |
| 排班 | /schedules/date/{date} | GET | 按日期获取排班 |
| 预约 | /appointments | GET | 获取预约列表 |
| 预约 | /appointments/{id} | GET | 获取单个预约 |
| 预约 | /appointments | POST | 创建预约 |
| 预约 | /appointments/{id} | PUT | 更新预约 |
| 预约 | /appointments/{id} | DELETE | 取消预约 |
| 预约 | /appointments/patient/{id} | GET | 按患者获取预约 |
| 预约 | /appointments/doctor/{id} | GET | 按医生获取预约 |
| 预约 | /appointments/status/{status} | GET | 按状态获取预约 |
| 预约 | /appointments/time-range | GET | 按时间范围获取预约 |

---

## 7. 错误处理规范

### 7.1 HTTP 错误处理
| 状态码 | 处理方式 |
|--------|----------|
| 400 | 显示"请求参数错误"，高亮错误字段 |
| 401 | 清除token，跳转登录页 |
| 403 | 显示"您没有权限执行此操作" |
| 404 | 显示"请求的资源不存在" |
| 500 | 显示"服务器内部错误，请稍后重试" |

### 7.2 业务错误处理
- 根据响应中的 `code` 字段判断
- 显示具体业务错误信息
- 1001-1006: 用户相关错误
- 2001-2002: 科室相关错误
- 3001-3002: 医生相关错误
- 4001-4003: 排班相关错误
- 5001-5004: 预约相关错误

### 7.3 网络错误处理
- 显示"网络连接失败，请检查网络"
- 提供重试按钮

---

## 8. 路由结构

```
/login                    - 登录页 (公开)
/                          - 首页仪表盘 (需认证)
/users                    - 用户管理 (需认证，ADMIN)
/users/new                - 新增用户 (需认证，ADMIN)
/users/:id/edit           - 编辑用户 (需认证，ADMIN)
/departments              - 科室管理 (需认证，ADMIN)
/departments/new          - 新增科室 (需认证，ADMIN)
/departments/:id/edit     - 编辑科室 (需认证，ADMIN)
/doctors                  - 医生管理 (需认证，ADMIN)
/doctors/new              - 新增医生 (需认证，ADMIN)
/doctors/:id/edit         - 编辑医生 (需认证，ADMIN)
/schedules                - 排班管理 (需认证，ADMIN)
/schedules/new            - 新增排班 (需认证，ADMIN)
/schedules/:id/edit       - 编辑排班 (需认证，ADMIN)
/appointments             - 预约管理 (需认证，ADMIN)
/appointments/:id         - 预约详情 (需认证，ADMIN)
/statistics               - 统计报表 (需认证，ADMIN)
```

---

## 9. 文件结构

```
src/
├── assets/
├── components/
│   ├── common/
│   │   ├── Button.jsx
│   │   ├── Input.jsx
│   │   ├── Select.jsx
│   │   ├── Table.jsx
│   │   ├── Modal.jsx
│   │   ├── Card.jsx
│   │   ├── StatusBadge.jsx
│   │   ├── Pagination.jsx
│   │   └── ConfirmDialog.jsx
│   ├── Layout/
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   └── Header.jsx
│   └── ...
├── context/
│   ├── AuthContext.jsx
│   └── AppContext.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useFetch.js
│   └── usePagination.js
├── pages/
│   ├── Login/
│   ├── Dashboard/
│   ├── Users/
│   ├── Departments/
│   ├── Doctors/
│   ├── Schedules/
│   ├── Appointments/
│   └── Statistics/
├── services/
│   ├── api.js
│   ├── authService.js
│   ├── userService.js
│   ├── departmentService.js
│   ├── doctorService.js
│   ├── scheduleService.js
│   └── appointmentService.js
├── utils/
│   ├── constants.js
│   ├── helpers.js
│   └── validators.js
├── styles/
│   └── global.css
├── App.jsx
└── main.jsx
```

---

## 10. 安全性考虑

### 10.1 前端安全
- JWT令牌存储在localStorage
- 敏感操作需二次确认
- 表单输入严格验证
- 防止XSS攻击 (React自动转义)

### 10.2 权限控制
- 路由守卫检查登录状态
- 按钮级别权限控制
- API请求携带认证令牌

### 10.3 数据安全
- 敏感信息不打印到console
- 错误信息不暴露内部细节
- 操作日志记录

---

## 11. 可访问性 (Accessibility)

- 所有表单元素有label关联
- 键盘导航支持
- 适当的aria标签
- 足够的颜色对比度
- 焦点状态可见
