# 智能挂号预约系统 API 规范

## 1. 接口规范设计

### 1.1 RESTful API 设计标准

#### 1.1.1 资源命名规范
- 使用复数名词表示资源（如 `/users`、`/doctors`）
- 使用连字符（-）分隔多个单词（如 `/appointment-slots`）
- 避免使用动词（如 `/get-users` 应改为 `/users`）
- 嵌套资源使用路径表示（如 `/departments/{id}/doctors`）

#### 1.1.2 HTTP 方法使用
- `GET`：获取资源（单个或列表）
- `POST`：创建新资源
- `PUT`：更新资源（全部字段）
- `PATCH`：更新资源（部分字段）
- `DELETE`：删除资源

#### 1.1.3 请求格式
- 使用 JSON 格式作为请求体
- 所有请求参数应符合 JSON 标准格式
- 对于查询参数，使用 URL 查询字符串传递

#### 1.1.4 响应格式
- 统一使用 JSON 格式返回
- 成功响应结构：
  ```json
  {
    "code": 200,
    "message": "成功",
    "data": {...}
  }
  ```
- 错误响应结构：
  ```json
  {
    "code": 400,
    "message": "错误信息",
    "error": "详细错误描述"
  }
  ```

### 1.2 状态码定义

| 状态码 | 描述 | 说明 |
|--------|------|------|
| 200 | OK | 请求成功 |
| 201 | Created | 资源创建成功 |
| 204 | No Content | 请求成功但无返回内容 |
| 400 | Bad Request | 请求参数错误 |
| 401 | Unauthorized | 未授权，需要登录 |
| 403 | Forbidden | 禁止访问，权限不足 |
| 404 | Not Found | 资源不存在 |
| 405 | Method Not Allowed | HTTP 方法不允许 |
| 500 | Internal Server Error | 服务器内部错误 |
| 503 | Service Unavailable | 服务不可用 |

### 1.3 错误处理机制

- 统一错误响应格式
- 错误代码与 HTTP 状态码对应
- 详细的错误信息描述
- 日志记录错误详情

### 1.4 版本控制策略

- 使用 URL 路径版本控制（如 `/api/v1/users`）
- 版本号使用数字形式（v1, v2, v3...）
- 向后兼容原则
- 废弃版本的过渡期

### 1.5 接口命名规范

| 模块 | 接口路径 | 方法 | 功能描述 |
|------|---------|------|----------|
| 用户管理 | /api/v1/users | GET | 获取用户列表 |
| 用户管理 | /api/v1/users/{id} | GET | 获取单个用户信息 |
| 用户管理 | /api/v1/users | POST | 创建新用户 |
| 用户管理 | /api/v1/users/{id} | PUT | 更新用户信息 |
| 用户管理 | /api/v1/users/{id} | DELETE | 删除用户 |
| 用户管理 | /api/v1/auth/login | POST | 用户登录 |
| 用户管理 | /api/v1/auth/refresh | POST | 刷新令牌 |
| 科室管理 | /api/v1/departments | GET | 获取科室列表 |
| 科室管理 | /api/v1/departments/{id} | GET | 获取单个科室信息 |
| 科室管理 | /api/v1/departments | POST | 创建新科室 |
| 科室管理 | /api/v1/departments/{id} | PUT | 更新科室信息 |
| 科室管理 | /api/v1/departments/{id} | DELETE | 删除科室 |
| 医生管理 | /api/v1/doctors | GET | 获取医生列表 |
| 医生管理 | /api/v1/doctors/{id} | GET | 获取单个医生信息 |
| 医生管理 | /api/v1/doctors | POST | 创建新医生 |
| 医生管理 | /api/v1/doctors/{id} | PUT | 更新医生信息 |
| 医生管理 | /api/v1/doctors/{id} | DELETE | 删除医生 |
| 排班管理 | /api/v1/schedules | GET | 获取排班列表 |
| 排班管理 | /api/v1/schedules | POST | 创建排班 |
| 排班管理 | /api/v1/schedules/{id} | PUT | 更新排班 |
| 排班管理 | /api/v1/schedules/{id} | DELETE | 删除排班 |
| 预约管理 | /api/v1/appointments | GET | 获取预约列表 |
| 预约管理 | /api/v1/appointments/{id} | GET | 获取单个预约信息 |
| 预约管理 | /api/v1/appointments | POST | 创建新预约 |
| 预约管理 | /api/v1/appointments/{id} | PUT | 更新预约状态 |
| 预约管理 | /api/v1/appointments/{id} | DELETE | 取消预约 |

## 2. 安全认证方案

### 2.1 JWT 令牌认证

- 使用 JSON Web Token (JWT) 进行身份认证
- 令牌有效期设置为 24 小时
- 包含用户 ID、角色等信息
- 支持令牌刷新机制

### 2.2 权限管理系统

- 基于角色的访问控制 (RBAC)
- 预定义角色：
  - ADMIN：管理员
  - DOCTOR：医生
  - PATIENT：患者
- 权限控制粒度到接口级别
- 支持权限动态分配

### 2.3 数据加密传输

- 强制使用 HTTPS 协议
- TLS 1.2 及以上版本
- 定期更新 SSL 证书

### 2.4 防攻击措施

- **防 SQL 注入**：使用参数化查询
- **XSS 防护**：输入验证和输出编码
- **CSRF 防护**：使用 CSRF 令牌
- **速率限制**：防止暴力攻击
- **输入验证**：所有输入参数严格验证
- **敏感信息保护**：密码哈希存储，敏感数据加密

## 3. 项目结构规划

```
src/
├── main/
│   ├── java/
│   │   └── com/
│   │       └── exclusive/
│   │           └── blank/
│   │               ├── SmartRegistrationApplication.java
│   │               ├── config/
│   │               │   ├── SecurityConfig.java
│   │               │   ├── JwtConfig.java
│   │               │   └── SwaggerConfig.java
│   │               ├── controller/
│   │               │   ├── AuthController.java
│   │               │   ├── UserController.java
│   │               │   ├── DepartmentController.java
│   │               │   ├── DoctorController.java
│   │               │   ├── ScheduleController.java
│   │               │   └── AppointmentController.java
│   │               ├── service/
│   │               │   ├── AuthService.java
│   │               │   ├── UserService.java
│   │               │   ├── DepartmentService.java
│   │               │   ├── DoctorService.java
│   │               │   ├── ScheduleService.java
│   │               │   └── AppointmentService.java
│   │               ├── repository/
│   │               │   ├── UserRepository.java
│   │               │   ├── DepartmentRepository.java
│   │               │   ├── DoctorRepository.java
│   │               │   ├── ScheduleRepository.java
│   │               │   └── AppointmentRepository.java
│   │               ├── model/
│   │               │   ├── User.java
│   │               │   ├── Department.java
│   │               │   ├── Doctor.java
│   │               │   ├── Schedule.java
│   │               │   └── Appointment.java
│   │               ├── dto/
│   │               │   ├── LoginRequest.java
│   │               │   ├── RegisterRequest.java
│   │               │   ├── UserResponse.java
│   │               │   ├── DoctorResponse.java
│   │               │   ├── AppointmentRequest.java
│   │               │   └── AppointmentResponse.java
│   │               ├── exception/
│   │               │   ├── GlobalExceptionHandler.java
│   │               │   ├── BusinessException.java
│   │               │   └── ErrorCode.java
│   │               ├── security/
│   │               │   ├── JwtTokenProvider.java
│   │               │   ├── JwtAuthenticationFilter.java
│   │               │   └── CustomUserDetailsService.java
│   │               ├── util/
│   │               │   ├── DateUtil.java
│   │               │   ├── EncryptionUtil.java
│   │               │   └── ValidationUtil.java
│   │               └── middleware/
│   │                   ├── RateLimitMiddleware.java
│   │                   └── LoggingMiddleware.java
│   └── resources/
│       ├── application.properties
│       └── application-dev.properties
└── test/
    └── java/
        └── com/
            └── exclusive/
                └── blank/
                    ├── controller/
                    ├── service/
                    └── repository/
```

## 4. 数据库构建方案

### 4.1 数据库模型

#### 4.1.1 用户表 (users)
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(50) | UNIQUE, NOT NULL | 用户名 |
| password | VARCHAR(100) | NOT NULL | 密码（哈希存储） |
| name | VARCHAR(50) | NOT NULL | 姓名 |
| gender | VARCHAR(10) | NOT NULL | 性别 |
| age | INT | NOT NULL | 年龄 |
| phone | VARCHAR(20) | UNIQUE, NOT NULL | 手机号码 |
| email | VARCHAR(100) | UNIQUE | 邮箱 |
| id_card | VARCHAR(18) | UNIQUE | 身份证号 |
| role | VARCHAR(20) | NOT NULL | 角色（ADMIN/DOCTOR/PATIENT） |
| status | VARCHAR(20) | NOT NULL | 状态（ACTIVE/INACTIVE） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

#### 4.1.2 科室表 (departments)
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 科室ID |
| name | VARCHAR(50) | UNIQUE, NOT NULL | 科室名称 |
| description | VARCHAR(255) | | 科室描述 |
| status | VARCHAR(20) | NOT NULL | 状态（ACTIVE/INACTIVE） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

#### 4.1.3 医生表 (doctors)
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 医生ID |
| user_id | BIGINT | FOREIGN KEY (users.id) | 用户ID（关联用户表） |
| department_id | BIGINT | FOREIGN KEY (departments.id) | 科室ID（关联科室表） |
| title | VARCHAR(50) | NOT NULL | 职称 |
| specialty | VARCHAR(100) | | 专长 |
| bio | VARCHAR(255) | | 简介 |
| status | VARCHAR(20) | NOT NULL | 状态（ACTIVE/INACTIVE） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

#### 4.1.4 排班表 (schedules)
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 排班ID |
| doctor_id | BIGINT | FOREIGN KEY (doctors.id) | 医生ID（关联医生表） |
| date | DATE | NOT NULL | 排班日期 |
| start_time | TIME | NOT NULL | 开始时间 |
| end_time | TIME | NOT NULL | 结束时间 |
| max_patients | INT | NOT NULL | 最大预约人数 |
| available_slots | INT | NOT NULL | 可用预约数 |
| status | VARCHAR(20) | NOT NULL | 状态（ACTIVE/CANCELLED） |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

#### 4.1.5 预约表 (appointments)
| 字段名 | 数据类型 | 约束 | 描述 |
|--------|---------|------|------|
| id | BIGINT | PRIMARY KEY, AUTO_INCREMENT | 预约ID |
| patient_id | BIGINT | FOREIGN KEY (users.id) | 患者ID（关联用户表） |
| doctor_id | BIGINT | FOREIGN KEY (doctors.id) | 医生ID（关联医生表） |
| schedule_id | BIGINT | FOREIGN KEY (schedules.id) | 排班ID（关联排班表） |
| appointment_time | DATETIME | NOT NULL | 预约时间 |
| status | VARCHAR(20) | NOT NULL | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |
| symptoms | VARCHAR(255) | | 症状描述 |
| created_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP | 更新时间 |

### 4.2 索引策略

- **用户表**：
  - `username` 唯一索引
  - `phone` 唯一索引
  - `id_card` 唯一索引
  - `email` 唯一索引
  - `role` 普通索引

- **科室表**：
  - `name` 唯一索引

- **医生表**：
  - `user_id` 唯一索引
  - `department_id` 普通索引
  - `status` 普通索引

- **排班表**：
  - `doctor_id` 普通索引
  - `date` 普通索引
  - `status` 普通索引
  - 联合索引 `(doctor_id, date)`

- **预约表**：
  - `patient_id` 普通索引
  - `doctor_id` 普通索引
  - `schedule_id` 普通索引
  - `status` 普通索引
  - 联合索引 `(patient_id, status)`

### 4.3 数据备份与恢复方案

- **定期备份**：
  - 每日全量备份
  - 每周增量备份
  - 每月归档备份

- **备份存储**：
  - 本地存储
  - 云存储（如 AWS S3、阿里云 OSS）
  - 异地备份

- **恢复策略**：
  - 定期测试恢复流程
  - 制定详细的恢复计划
  - 确保备份数据的完整性和可用性

- **监控与告警**：
  - 备份失败告警
  - 备份存储容量监控
  - 数据一致性检查

## 5. 文档生成要求

### 5.1 API 文档
- 使用 Swagger 自动生成 API 文档
- 详细描述每个接口的请求参数、响应格式、错误码等
- 提供接口测试功能
- 文档地址：`/api/v1/swagger-ui.html`

### 5.2 架构设计文档
- 详细描述系统架构和模块划分
- 说明各模块的职责和关系
- 包含系统流程图和架构图

### 5.3 数据库设计文档
- 详细描述数据库模型和表结构
- 说明字段含义和约束
- 提供表关系图
- 描述索引策略和数据备份方案

### 5.4 文档存放位置
- 所有文档统一存放于项目根目录下的 `doc` 文件夹中
- 文档命名规范：
  - API 规范：`API规范.md`
  - 架构设计：`架构设计.md`
  - 数据库设计：`数据库设计.md`
