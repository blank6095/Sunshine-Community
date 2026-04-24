# 智能挂号预约系统 API 文档

> **文档版本**: v3.0  
> **更新日期**: 2026-04-24  
> **说明**: 本文档已更新，所有响应格式统一使用 `ApiResponse` 包装，返回字段与实际DTO类完全一致。

## 1. 接口概述

智能挂号预约系统提供 RESTful API 接口，支持用户认证、科室管理、医生管理、排班管理和预约管理等功能。所有接口均使用 JSON 格式进行数据交换，采用 JWT 进行身份认证。

### 1.1 基础 URL

```
http://localhost:8080/api/v1
```

### 1.2 认证方式

- 使用 JWT 令牌进行认证
- 在请求头中添加 `Authorization: Bearer {token}`
- 令牌有效期为 24 小时

### 1.3 统一响应格式

**成功响应格式**（所有接口统一使用）：

```json
{
  "code": 200,
  "message": "成功",
  "data": { ... },
  "error": null
}
```

**创建成功响应**（POST接口）：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": { ... },
  "error": null
}
```

**错误响应格式**：

```json
{
  "code": 400,
  "message": "请求参数错误",
  "error": "BAD_REQUEST",
  "errorType": "BUSINESS",
  "requestPath": "/api/v1/users",
  "requestMethod": "POST",
  "timestamp": "2026-04-24T10:30:00",
  "suggestion": "请检查输入参数"
}
```

---

## 2. 认证接口

### 2.1 用户登录

**接口路径**：`/auth/login`  
**请求方法**：POST  
**是否需要认证**：否

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |

**请求示例**：

```json
{
  "username": "admin",
  "password": "123456"
}
```

**响应数据结构**：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| token | String | JWT认证令牌 |
| user | Object | 用户信息对象 |
| user.id | Long | 用户ID |
| user.username | String | 用户名 |
| user.name | String | 姓名 |
| user.role | String | 角色（ADMIN/DOCTOR/PATIENT） |
| user.status | String | 状态（ACTIVE/INACTIVE） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "role": "ADMIN",
      "status": "ACTIVE"
    }
  },
  "error": null
}
```

### 2.2 刷新令牌

**接口路径**：`/auth/refresh`  
**请求方法**：POST  
**是否需要认证**：否

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| token | String | 是 | 旧令牌 |

**请求示例**：

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "error": null
}
```

### 2.3 用户注册

**接口路径**：`/auth/register`  
**请求方法**：POST  
**是否需要认证**：否

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | String | 是 | 用户名（3-20字符） |
| password | String | 是 | 密码（最少6字符） |
| name | String | 是 | 姓名 |
| gender | String | 是 | 性别（男/女/M/F） |
| age | Integer | 是 | 年龄（1-150） |
| phone | String | 是 | 手机号码（11位） |
| email | String | 否 | 邮箱 |
| idCard | String | 否 | 身份证号（18位） |
| role | String | 是 | 角色（ADMIN/DOCTOR/PATIENT） |

**请求示例**：

```json
{
  "username": "patient1",
  "password": "123456",
  "name": "患者1",
  "gender": "女",
  "age": 25,
  "phone": "13900139000",
  "email": "patient1@example.com",
  "idCard": "110101199501011234",
  "role": "PATIENT"
}
```

**响应数据结构**（同 UserResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 用户ID |
| username | String | 用户名 |
| name | String | 姓名 |
| gender | String | 性别 |
| age | Integer | 年龄 |
| phone | String | 手机号码 |
| email | String | 邮箱 |
| idCard | String | 身份证号 |
| role | String | 角色 |
| status | String | 状态 |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "username": "patient1",
    "name": "患者1",
    "gender": "女",
    "age": 25,
    "phone": "13900139000",
    "email": "patient1@example.com",
    "idCard": "110101199501011234",
    "role": "PATIENT",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

---

## 3. 用户管理接口

### 3.1 获取用户列表

**接口路径**：`/users`  
**请求方法**：GET  
**权限要求**：ADMIN

**响应数据结构**（数组，每个元素为 UserResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 用户ID |
| username | String | 用户名 |
| name | String | 姓名 |
| gender | String | 性别 |
| age | Integer | 年龄 |
| phone | String | 手机号码 |
| email | String | 邮箱 |
| idCard | String | 身份证号 |
| role | String | 角色 |
| status | String | 状态 |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

> **注意**：响应中**不包含** password 字段（安全考虑）

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "username": "admin",
      "name": "管理员",
      "gender": "男",
      "age": 30,
      "phone": "13800138000",
      "email": "admin@example.com",
      "idCard": "110101199001011234",
      "role": "ADMIN",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 3.2 获取单个用户信息

**接口路径**：`/users/{id}`  
**请求方法**：GET  
**权限要求**：ADMIN 或本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 用户ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员",
    "gender": "男",
    "age": 30,
    "phone": "13800138000",
    "email": "admin@example.com",
    "idCard": "110101199001011234",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 3.3 更新用户信息

**接口路径**：`/users/{id}`  
**请求方法**：PUT  
**权限要求**：ADMIN 或本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 用户ID |

**请求参数**（所有字段均为可选）：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 否 | 姓名（最大20字符） |
| gender | String | 否 | 性别（男/女/M/F） |
| age | Integer | 否 | 年龄（1-150） |
| phone | String | 否 | 手机号码（11位） |
| email | String | 否 | 邮箱 |
| idCard | String | 否 | 身份证号（18位） |
| status | String | 否 | 状态（ACTIVE/INACTIVE） |

**请求示例**：

```json
{
  "name": "管理员更新",
  "age": 31,
  "phone": "13800138001"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 1,
    "username": "admin",
    "name": "管理员更新",
    "gender": "男",
    "age": 31,
    "phone": "13800138001",
    "email": "admin@example.com",
    "idCard": "110101199001011234",
    "role": "ADMIN",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T11:00:00"
  },
  "error": null
}
```

### 3.4 删除用户

**接口路径**：`/users/{id}`  
**请求方法**：DELETE  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 用户ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "error": null
}
```

---

## 4. 科室管理接口

### 4.1 获取科室列表

**接口路径**：`/departments`  
**请求方法**：GET  
**是否需要认证**：否

**响应数据结构**（数组，每个元素为 DepartmentResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 科室ID |
| name | String | 科室名称 |
| description | String | 科室描述 |
| status | String | 状态（ACTIVE/INACTIVE） |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "name": "内科",
      "description": "内科科室",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    },
    {
      "id": 2,
      "name": "外科",
      "description": "外科科室",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 4.2 获取单个科室信息

**接口路径**：`/departments/{id}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 科室ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "name": "内科",
    "description": "内科科室",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 4.3 创建新科室

**接口路径**：`/departments`  
**请求方法**：POST  
**权限要求**：ADMIN

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 是 | 科室名称（最大50字符） |
| description | String | 否 | 科室描述 |
| status | String | 否 | 状态（ACTIVE/INACTIVE），默认ACTIVE |

**请求示例**：

```json
{
  "name": "骨科",
  "description": "骨科科室"
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 3,
    "name": "骨科",
    "description": "骨科科室",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 4.4 更新科室信息

**接口路径**：`/departments/{id}`  
**请求方法**：PUT  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 科室ID |

**请求参数**（所有字段均为可选）：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 否 | 科室名称（最大50字符） |
| description | String | 否 | 科室描述 |
| status | String | 否 | 状态（ACTIVE/INACTIVE） |

**请求示例**：

```json
{
  "name": "骨科更新",
  "description": "骨科科室更新"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 3,
    "name": "骨科更新",
    "description": "骨科科室更新",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T11:00:00"
  },
  "error": null
}
```

### 4.5 删除科室

**接口路径**：`/departments/{id}`  
**请求方法**：DELETE  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 科室ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "error": null
}
```

---

## 5. 医生管理接口

### 5.1 获取医生列表

**接口路径**：`/doctors`  
**请求方法**：GET  
**是否需要认证**：是

**响应数据结构**（数组，每个元素为 DoctorResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 医生ID |
| userId | Long | 关联用户ID |
| userName | String | 医生姓名 |
| userPhone | String | 医生电话 |
| userEmail | String | 医生邮箱 |
| departmentId | Long | 科室ID |
| departmentName | String | 科室名称 |
| title | String | 职称 |
| specialty | String | 专长 |
| bio | String | 简介 |
| status | String | 状态（ACTIVE/INACTIVE） |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

> **注意**：医生响应使用扁平化结构，不包含嵌套的 user 和 department 对象

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "userId": 3,
      "userName": "张医生",
      "userPhone": "13800138001",
      "userEmail": "doctor1@example.com",
      "departmentId": 1,
      "departmentName": "内科",
      "title": "主任医师",
      "specialty": "心血管疾病",
      "bio": "从事心血管疾病诊疗工作20年",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 5.2 获取单个医生信息

**接口路径**：`/doctors/{id}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 医生ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "userId": 3,
    "userName": "张医生",
    "userPhone": "13800138001",
    "userEmail": "doctor1@example.com",
    "departmentId": 1,
    "departmentName": "内科",
    "title": "主任医师",
    "specialty": "心血管疾病",
    "bio": "从事心血管疾病诊疗工作20年",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 5.3 创建新医生

**接口路径**：`/doctors`  
**请求方法**：POST  
**权限要求**：ADMIN

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| user | Object | 是 | 用户信息（只需传id） |
| department | Object | 是 | 科室信息（只需传id） |
| title | String | 是 | 职称 |
| specialty | String | 否 | 专长 |
| bio | String | 否 | 简介 |
| status | String | 否 | 状态（ACTIVE/INACTIVE），默认ACTIVE |

**请求示例**：

```json
{
  "user": {
    "id": 4
  },
  "department": {
    "id": 1
  },
  "title": "副主任医师",
  "specialty": "消化系统疾病",
  "bio": "从事消化系统疾病诊疗工作15年"
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "userId": 4,
    "userName": "李医生",
    "userPhone": "13800138002",
    "userEmail": "doctor2@example.com",
    "departmentId": 1,
    "departmentName": "内科",
    "title": "副主任医师",
    "specialty": "消化系统疾病",
    "bio": "从事消化系统疾病诊疗工作15年",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 5.4 更新医生信息

**接口路径**：`/doctors/{id}`  
**请求方法**：PUT  
**权限要求**：ADMIN 或本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 医生ID |

**请求参数**（所有字段均为可选）：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| department | Object | 否 | 科室信息（只需传id） |
| title | String | 否 | 职称 |
| specialty | String | 否 | 专长 |
| bio | String | 否 | 简介 |
| status | String | 否 | 状态（ACTIVE/INACTIVE） |

**请求示例**：

```json
{
  "title": "主任医师",
  "specialty": "消化系统疾病（擅长胃肠疾病）"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "userId": 4,
    "userName": "李医生",
    "userPhone": "13800138002",
    "userEmail": "doctor2@example.com",
    "departmentId": 1,
    "departmentName": "内科",
    "title": "主任医师",
    "specialty": "消化系统疾病（擅长胃肠疾病）",
    "bio": "从事消化系统疾病诊疗工作15年",
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T11:00:00"
  },
  "error": null
}
```

### 5.5 删除医生

**接口路径**：`/doctors/{id}`  
**请求方法**：DELETE  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 医生ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "error": null
}
```

### 5.6 按科室获取医生

**接口路径**：`/doctors/department/{departmentId}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| departmentId | Long | 是 | 科室ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "userId": 3,
      "userName": "张医生",
      "userPhone": "13800138001",
      "userEmail": "doctor1@example.com",
      "departmentId": 1,
      "departmentName": "内科",
      "title": "主任医师",
      "specialty": "心血管疾病",
      "bio": "从事心血管疾病诊疗工作20年",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 5.7 按状态获取医生

**接口路径**：`/doctors/status/{status}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | String | 是 | 状态（ACTIVE/INACTIVE） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "userId": 3,
      "userName": "张医生",
      "userPhone": "13800138001",
      "userEmail": "doctor1@example.com",
      "departmentId": 1,
      "departmentName": "内科",
      "title": "主任医师",
      "specialty": "心血管疾病",
      "bio": "从事心血管疾病诊疗工作20年",
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

---

## 6. 排班管理接口

### 6.1 获取排班列表

**接口路径**：`/schedules`  
**请求方法**：GET  
**是否需要认证**：是

**响应数据结构**（数组，每个元素为 ScheduleResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 排班ID |
| doctorId | Long | 医生ID |
| doctorName | String | 医生姓名 |
| departmentId | Long | 科室ID |
| departmentName | String | 科室名称 |
| date | LocalDate | 日期（YYYY-MM-DD） |
| startTime | LocalTime | 开始时间（HH:MM） |
| endTime | LocalTime | 结束时间（HH:MM） |
| maxPatients | Integer | 最大预约人数 |
| availableSlots | Integer | 可用预约数 |
| status | String | 状态（ACTIVE/CANCELLED） |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

> **注意**：排班响应使用扁平化结构，不包含嵌套的 doctor 对象

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "date": "2026-04-25",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "availableSlots": 15,
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 6.2 获取单个排班信息

**接口路径**：`/schedules/{id}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 排班ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentId": 1,
    "departmentName": "内科",
    "date": "2026-04-25",
    "startTime": "08:00:00",
    "endTime": "12:00:00",
    "maxPatients": 20,
    "availableSlots": 15,
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 6.3 创建排班

**接口路径**：`/schedules`  
**请求方法**：POST  
**权限要求**：ADMIN

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctor | Object | 是 | 医生信息（只需传id） |
| date | String | 是 | 日期（格式：YYYY-MM-DD） |
| startTime | String | 是 | 开始时间（格式：HH:MM） |
| endTime | String | 是 | 结束时间（格式：HH:MM） |
| maxPatients | Integer | 是 | 最大预约人数（必须>0） |
| status | String | 否 | 状态（ACTIVE/CANCELLED），默认ACTIVE |

**请求示例**：

```json
{
  "doctor": {
    "id": 1
  },
  "date": "2026-04-26",
  "startTime": "14:00",
  "endTime": "18:00",
  "maxPatients": 15
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentId": 1,
    "departmentName": "内科",
    "date": "2026-04-26",
    "startTime": "14:00:00",
    "endTime": "18:00:00",
    "maxPatients": 15,
    "availableSlots": 15,
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 6.4 更新排班

**接口路径**：`/schedules/{id}`  
**请求方法**：PUT  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 排班ID |

**请求参数**（所有字段均为可选）：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctor | Object | 否 | 医生信息（只需传id） |
| date | String | 否 | 日期（格式：YYYY-MM-DD） |
| startTime | String | 否 | 开始时间（格式：HH:MM） |
| endTime | String | 否 | 结束时间（格式：HH:MM） |
| maxPatients | Integer | 否 | 最大预约人数（必须>0） |
| status | String | 否 | 状态（ACTIVE/CANCELLED） |

**请求示例**：

```json
{
  "maxPatients": 25,
  "status": "ACTIVE"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentId": 1,
    "departmentName": "内科",
    "date": "2026-04-26",
    "startTime": "14:00:00",
    "endTime": "18:00:00",
    "maxPatients": 25,
    "availableSlots": 15,
    "status": "ACTIVE",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T11:00:00"
  },
  "error": null
}
```

### 6.5 删除排班

**接口路径**：`/schedules/{id}`  
**请求方法**：DELETE  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 排班ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "error": null
}
```

### 6.6 按医生获取排班

**接口路径**：`/schedules/doctor/{doctorId}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctorId | Long | 是 | 医生ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "date": "2026-04-25",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "availableSlots": 15,
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 6.7 按日期获取排班

**接口路径**：`/schedules/date/{date}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| date | String | 是 | 日期（格式：YYYY-MM-DD） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "date": "2026-04-25",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "availableSlots": 15,
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 6.8 按医生和日期获取排班

**接口路径**：`/schedules/doctor/{doctorId}/date/{date}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctorId | Long | 是 | 医生ID |
| date | String | 是 | 日期（格式：YYYY-MM-DD） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "date": "2026-04-25",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "availableSlots": 15,
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 6.9 按状态获取排班

**接口路径**：`/schedules/status/{status}`  
**请求方法**：GET  
**是否需要认证**：是

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | String | 是 | 状态（ACTIVE/CANCELLED） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentId": 1,
      "departmentName": "内科",
      "date": "2026-04-25",
      "startTime": "08:00:00",
      "endTime": "12:00:00",
      "maxPatients": 20,
      "availableSlots": 15,
      "status": "ACTIVE",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

---

## 7. 预约管理接口

### 7.1 获取预约列表

**接口路径**：`/appointments`  
**请求方法**：GET  
**权限要求**：ADMIN

**响应数据结构**（数组，每个元素为 AppointmentResponse）：

| 字段名 | 类型 | 描述 |
|--------|------|------|
| id | Long | 预约ID |
| patientId | Long | 患者ID |
| patientName | String | 患者姓名 |
| doctorId | Long | 医生ID |
| doctorName | String | 医生姓名 |
| departmentName | String | 科室名称 |
| scheduleId | Long | 排班ID |
| appointmentTime | LocalDateTime | 预约时间 |
| status | String | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |
| symptoms | String | 症状描述 |
| createdAt | LocalDateTime | 创建时间 |
| updatedAt | LocalDateTime | 更新时间 |

> **注意**：预约响应使用扁平化结构，不包含嵌套的 patient、doctor、schedule 对象

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.2 获取单个预约信息

**接口路径**：`/appointments/{id}`  
**请求方法**：GET  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 预约ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "id": 1,
    "patientId": 2,
    "patientName": "患者1",
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentName": "内科",
    "scheduleId": 1,
    "appointmentTime": "2026-04-25T08:30:00",
    "status": "CONFIRMED",
    "symptoms": "头痛",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 7.3 创建新预约

**接口路径**：`/appointments`  
**请求方法**：POST  
**权限要求**：PATIENT

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| patient | Object | 是 | 患者信息（只需传id） |
| doctor | Object | 是 | 医生信息（只需传id） |
| schedule | Object | 是 | 排班信息（只需传id） |
| appointmentTime | String | 是 | 预约时间（格式：YYYY-MM-DDTHH:MM:SS） |
| symptoms | String | 否 | 症状描述 |
| status | String | 否 | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED），默认PENDING |

**请求示例**：

```json
{
  "patient": {
    "id": 2
  },
  "doctor": {
    "id": 1
  },
  "schedule": {
    "id": 1
  },
  "appointmentTime": "2026-04-25T09:00:00",
  "symptoms": "头痛、头晕"
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "patientId": 2,
    "patientName": "患者1",
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentName": "内科",
    "scheduleId": 1,
    "appointmentTime": "2026-04-25T09:00:00",
    "status": "PENDING",
    "symptoms": "头痛、头晕",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T10:00:00"
  },
  "error": null
}
```

### 7.4 更新预约

**接口路径**：`/appointments/{id}`  
**请求方法**：PUT  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 预约ID |

**请求参数**（所有字段均为可选）：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| appointmentTime | String | 否 | 预约时间（格式：YYYY-MM-DDTHH:MM:SS） |
| symptoms | String | 否 | 症状描述 |
| status | String | 否 | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |

**请求示例**：

```json
{
  "status": "CONFIRMED"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "patientId": 2,
    "patientName": "患者1",
    "doctorId": 1,
    "doctorName": "张医生",
    "departmentName": "内科",
    "scheduleId": 1,
    "appointmentTime": "2026-04-25T09:00:00",
    "status": "CONFIRMED",
    "symptoms": "头痛、头晕",
    "createdAt": "2026-04-24T10:00:00",
    "updatedAt": "2026-04-24T11:00:00"
  },
  "error": null
}
```

### 7.5 删除预约

**接口路径**：`/appointments/{id}`  
**请求方法**：DELETE  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 预约ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null,
  "error": null
}
```

### 7.6 按患者获取预约

**接口路径**：`/appointments/patient/{patientId}`  
**请求方法**：GET  
**权限要求**：ADMIN 或本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| patientId | Long | 是 | 患者ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.7 按医生获取预约

**接口路径**：`/appointments/doctor/{doctorId}`  
**请求方法**：GET  
**权限要求**：ADMIN 或医生本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctorId | Long | 是 | 医生ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.8 按排班获取预约

**接口路径**：`/appointments/schedule/{scheduleId}`  
**请求方法**：GET  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| scheduleId | Long | 是 | 排班ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.9 按状态获取预约

**接口路径**：`/appointments/status/{status}`  
**请求方法**：GET  
**权限要求**：ADMIN

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | String | 是 | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.10 按患者和状态获取预约

**接口路径**：`/appointments/patient/{patientId}/status/{status}`  
**请求方法**：GET  
**权限要求**：ADMIN 或本人

**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| patientId | Long | 是 | 患者ID |
| status | String | 是 | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

### 7.11 按时间范围获取预约

**接口路径**：`/appointments/time-range`  
**请求方法**：GET  
**权限要求**：ADMIN

**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| start | String | 是 | 开始时间（格式：YYYY-MM-DDTHH:MM:SS） |
| end | String | 是 | 结束时间（格式：YYYY-MM-DDTHH:MM:SS） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": [
    {
      "id": 1,
      "patientId": 2,
      "patientName": "患者1",
      "doctorId": 1,
      "doctorName": "张医生",
      "departmentName": "内科",
      "scheduleId": 1,
      "appointmentTime": "2026-04-25T08:30:00",
      "status": "CONFIRMED",
      "symptoms": "头痛",
      "createdAt": "2026-04-24T10:00:00",
      "updatedAt": "2026-04-24T10:00:00"
    }
  ],
  "error": null
}
```

---

## 8. 错误码定义

### 8.1 HTTP状态码

| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

### 8.2 业务错误码

| 错误码 | 错误类型 | 说明 |
|--------|---------|------|
| 1001 | USER_NOT_FOUND | 用户不存在 |
| 1002 | PASSWORD_ERROR | 密码错误 |
| 1003 | USERNAME_EXISTS | 用户名已存在 |
| 1004 | PHONE_EXISTS | 手机号码已存在 |
| 1005 | ID_CARD_EXISTS | 身份证号已存在 |
| 1006 | EMAIL_EXISTS | 邮箱已存在 |
| 2001 | DEPARTMENT_NOT_FOUND | 科室不存在 |
| 2002 | DEPARTMENT_NAME_EXISTS | 科室名称已存在 |
| 3001 | DOCTOR_NOT_FOUND | 医生不存在 |
| 3002 | USER_NOT_DOCTOR | 用户不是医生角色 |
| 4001 | SCHEDULE_NOT_FOUND | 排班不存在 |
| 4002 | SCHEDULE_CANCELLED | 排班已取消 |
| 4003 | SCHEDULE_FULL | 排班已满 |
| 5001 | APPOINTMENT_NOT_FOUND | 预约不存在 |
| 5002 | APPOINTMENT_COMPLETED | 预约已完成，无法操作 |
| 5003 | APPOINTMENT_CANCELLED | 预约已取消，无法操作 |
| 5004 | APPOINTMENT_TIME_PASSED | 预约时间已过，无法操作 |

---

## 9. 数据字典

### 9.1 角色类型

| 值 | 说明 |
|----|------|
| ADMIN | 管理员 |
| DOCTOR | 医生 |
| PATIENT | 患者 |

### 9.2 状态类型

| 资源 | 状态值 | 说明 |
|------|--------|------|
| 用户 | ACTIVE | 正常 |
| 用户 | INACTIVE | 停用 |
| 科室 | ACTIVE | 正常 |
| 科室 | INACTIVE | 停用 |
| 医生 | ACTIVE | 正常 |
| 医生 | INACTIVE | 停用 |
| 排班 | ACTIVE | 正常 |
| 排班 | CANCELLED | 已取消 |
| 预约 | PENDING | 待确认 |
| 预约 | CONFIRMED | 已确认 |
| 预约 | COMPLETED | 已完成 |
| 预约 | CANCELLED | 已取消 |

### 9.3 性别类型

| 值 | 说明 |
|----|------|
| 男 / M | 男性 |
| 女 / F | 女性 |

---

## 10. 版本变更记录

### v3.0 (2026-04-24)

**重大变更**：

1. **统一响应格式**：所有API接口响应统一使用 `ApiResponse` 包装格式
   - 所有响应包含 `code`、`message`、`data`、`error` 字段
   - 成功响应 code 为 200，创建成功 code 为 201

2. **医生响应格式变更**（重要）：
   - 旧版：嵌套结构 `{ user: {...}, department: {...}, title: ... }`
   - 新版：扁平化结构 `{ userId, userName, userPhone, userEmail, departmentId, departmentName, title, ... }`
   - 移除字段：`user`、`department` 对象
   - 新增字段：`userId`、`userName`、`userPhone`、`userEmail`、`departmentId`、`departmentName`

3. **排班响应格式变更**（重要）：
   - 旧版：嵌套结构 `{ doctor: { user: {...}, department: {...} }, date: ... }`
   - 新版：扁平化结构 `{ doctorId, doctorName, departmentId, departmentName, date, ... }`
   - 移除字段：`doctor` 对象
   - 新增字段：`doctorId`、`doctorName`、`departmentId`、`departmentName`

4. **预约响应格式变更**（重要）：
   - 旧版：嵌套结构 `{ patient: {...}, doctor: {...}, schedule: {...}, ... }`
   - 新版：扁平化结构 `{ patientId, patientName, doctorId, doctorName, departmentName, scheduleId, ... }`
   - 移除字段：`patient`、`doctor`、`schedule` 对象
   - 新增字段：`patientId`、`patientName`、`doctorId`、`doctorName`、`departmentName`、`scheduleId`

5. **用户响应安全修复**：
   - 移除 `password` 字段（安全漏洞修复）
   - 确保密码不会在任何API响应中暴露

6. **新增响应字段**：
   - 所有响应DTO新增 `createdAt`（创建时间）和 `updatedAt`（更新时间）字段

7. **新增接口**：
   - `GET /schedules/doctor/{doctorId}/date/{date}` - 按医生和日期组合查询排班
   - `GET /appointments/schedule/{scheduleId}` - 按排班查询预约
   - `GET /appointments/patient/{patientId}/status/{status}` - 按患者和状态组合查询预约
   - `GET /appointments/time-range` - 按时间范围查询预约

### v2.0 (2026-04-23)

- 完善用户注册验证规则
- 添加唯一性检查（用户名、手机号、邮箱、身份证号）
- 统一错误处理机制

### v1.0 (2026-04-22)

- 初始版本API文档
