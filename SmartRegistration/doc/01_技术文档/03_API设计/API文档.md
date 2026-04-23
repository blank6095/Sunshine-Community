# 智能挂号预约系统 API 文档

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

## 2. 认证接口

### 2.1 用户登录

**接口路径**：`/auth/login`
**请求方法**：POST
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
  }
}
```

### 2.2 刷新令牌

**接口路径**：`/auth/refresh`
**请求方法**：POST
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
  }
}
```

## 3. 用户管理接口

### 3.1 获取用户列表

**接口路径**：`/users`
**请求方法**：GET
**权限要求**：ADMIN
**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 10 |
| role | String | 否 | 角色筛选 |
| status | String | 否 | 状态筛选 |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 100,
    "pages": 10,
    "current": 1,
    "records": [
      {
        "id": 1,
        "username": "admin",
        "name": "管理员",
        "gender": "男",
        "age": 30,
        "phone": "13800138000",
        "email": "admin@example.com",
        "role": "ADMIN",
        "status": "ACTIVE",
        "created_at": "2023-01-01T00:00:00"
      }
    ]
  }
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
    "id_card": "110101199001011234",
    "role": "ADMIN",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 3.3 创建新用户

**接口路径**：`/users`
**请求方法**：POST
**权限要求**：ADMIN
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| username | String | 是 | 用户名 |
| password | String | 是 | 密码 |
| name | String | 是 | 姓名 |
| gender | String | 是 | 性别 |
| age | Integer | 是 | 年龄 |
| phone | String | 是 | 手机号码 |
| email | String | 否 | 邮箱 |
| id_card | String | 否 | 身份证号 |
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
  "id_card": "110101199501011234",
  "role": "PATIENT"
}
```

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
    "id_card": "110101199501011234",
    "role": "PATIENT",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 3.4 更新用户信息

**接口路径**：`/users/{id}`
**请求方法**：PUT
**权限要求**：ADMIN 或本人
**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 用户ID |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 否 | 姓名 |
| gender | String | 否 | 性别 |
| age | Integer | 否 | 年龄 |
| phone | String | 否 | 手机号码 |
| email | String | 否 | 邮箱 |
| id_card | String | 否 | 身份证号 |
| status | String | 否 | 状态（ACTIVE/INACTIVE） |

**请求示例**：

```json
{
  "name": "患者1更新",
  "age": 26,
  "phone": "13900139001"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "username": "patient1",
    "name": "患者1更新",
    "gender": "女",
    "age": 26,
    "phone": "13900139001",
    "email": "patient1@example.com",
    "id_card": "110101199501011234",
    "role": "PATIENT",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-02T00:00:00"
  }
}
```

### 3.5 删除用户

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
  "data": null
}
```

## 4. 科室管理接口

### 4.1 获取科室列表

**接口路径**：`/departments`
**请求方法**：GET
**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 10 |
| status | String | 否 | 状态筛选 |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 10,
    "pages": 1,
    "current": 1,
    "records": [
      {
        "id": 1,
        "name": "内科",
        "description": "内科科室",
        "status": "ACTIVE",
        "created_at": "2023-01-01T00:00:00"
      }
    ]
  }
}
```

### 4.2 获取单个科室信息

**接口路径**：`/departments/{id}`
**请求方法**：GET
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
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 4.3 创建新科室

**接口路径**：`/departments`
**请求方法**：POST
**权限要求**：ADMIN
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 是 | 科室名称 |
| description | String | 否 | 科室描述 |

**请求示例**：

```json
{
  "name": "外科",
  "description": "外科科室"
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "name": "外科",
    "description": "外科科室",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
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

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| name | String | 否 | 科室名称 |
| description | String | 否 | 科室描述 |
| status | String | 否 | 状态（ACTIVE/INACTIVE） |

**请求示例**：

```json
{
  "name": "外科更新",
  "description": "外科科室更新"
}
```

**响应示例**：

```json
{
  "code": 200,
  "message": "更新成功",
  "data": {
    "id": 2,
    "name": "外科更新",
    "description": "外科科室更新",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-02T00:00:00"
  }
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
  "data": null
}
```

## 5. 医生管理接口

### 5.1 获取医生列表

**接口路径**：`/doctors`
**请求方法**：GET
**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 10 |
| department_id | Long | 否 | 科室ID筛选 |
| status | String | 否 | 状态筛选 |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 50,
    "pages": 5,
    "current": 1,
    "records": [
      {
        "id": 1,
        "user": {
          "id": 3,
          "name": "医生1",
          "phone": "13800138001"
        },
        "department": {
          "id": 1,
          "name": "内科"
        },
        "title": "主任医师",
        "specialty": "心血管疾病",
        "status": "ACTIVE",
        "created_at": "2023-01-01T00:00:00"
      }
    ]
  }
}
```

### 5.2 获取单个医生信息

**接口路径**：`/doctors/{id}`
**请求方法**：GET
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
    "user": {
      "id": 3,
      "username": "doctor1",
      "name": "医生1",
      "gender": "男",
      "age": 45,
      "phone": "13800138001",
      "email": "doctor1@example.com"
    },
    "department": {
      "id": 1,
      "name": "内科",
      "description": "内科科室"
    },
    "title": "主任医师",
    "specialty": "心血管疾病",
    "bio": "从事心血管疾病诊疗工作20年",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 5.3 创建新医生

**接口路径**：`/doctors`
**请求方法**：POST
**权限要求**：ADMIN
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| user_id | Long | 是 | 用户ID（关联用户表） |
| department_id | Long | 是 | 科室ID（关联科室表） |
| title | String | 是 | 职称 |
| specialty | String | 否 | 专长 |
| bio | String | 否 | 简介 |

**请求示例**：

```json
{
  "user_id": 4,
  "department_id": 1,
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
    "user": {
      "id": 4,
      "name": "医生2"
    },
    "department": {
      "id": 1,
      "name": "内科"
    },
    "title": "副主任医师",
    "specialty": "消化系统疾病",
    "bio": "从事消化系统疾病诊疗工作15年",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
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

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| department_id | Long | 否 | 科室ID |
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
    "user": {
      "id": 4,
      "name": "医生2"
    },
    "department": {
      "id": 1,
      "name": "内科"
    },
    "title": "主任医师",
    "specialty": "消化系统疾病（擅长胃肠疾病）",
    "bio": "从事消化系统疾病诊疗工作15年",
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-02T00:00:00"
  }
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
  "data": null
}
```

## 6. 排班管理接口

### 6.1 获取排班列表

**接口路径**：`/schedules`
**请求方法**：GET
**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 10 |
| doctor_id | Long | 否 | 医生ID筛选 |
| date | String | 否 | 日期筛选（格式：YYYY-MM-DD） |
| status | String | 否 | 状态筛选 |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 100,
    "pages": 10,
    "current": 1,
    "records": [
      {
        "id": 1,
        "doctor": {
          "id": 1,
          "name": "医生1"
        },
        "date": "2023-01-01",
        "start_time": "08:00",
        "end_time": "12:00",
        "max_patients": 20,
        "available_slots": 15,
        "status": "ACTIVE",
        "created_at": "2023-01-01T00:00:00"
      }
    ]
  }
}
```

### 6.2 创建排班

**接口路径**：`/schedules`
**请求方法**：POST
**权限要求**：ADMIN 或医生本人
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctor_id | Long | 是 | 医生ID |
| date | String | 是 | 排班日期（格式：YYYY-MM-DD） |
| start_time | String | 是 | 开始时间（格式：HH:MM） |
| end_time | String | 是 | 结束时间（格式：HH:MM） |
| max_patients | Integer | 是 | 最大预约人数 |

**请求示例**：

```json
{
  "doctor_id": 1,
  "date": "2023-01-02",
  "start_time": "14:00",
  "end_time": "18:00",
  "max_patients": 15
}
```

**响应示例**：

```json
{
  "code": 201,
  "message": "创建成功",
  "data": {
    "id": 2,
    "doctor": {
      "id": 1,
      "name": "医生1"
    },
    "date": "2023-01-02",
    "start_time": "14:00",
    "end_time": "18:00",
    "max_patients": 15,
    "available_slots": 15,
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 6.3 更新排班

**接口路径**：`/schedules/{id}`
**请求方法**：PUT
**权限要求**：ADMIN 或医生本人
**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 排班ID |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| start_time | String | 否 | 开始时间（格式：HH:MM） |
| end_time | String | 否 | 结束时间（格式：HH:MM） |
| max_patients | Integer | 否 | 最大预约人数 |
| status | String | 否 | 状态（ACTIVE/CANCELLED） |

**请求示例**：

```json
{
  "max_patients": 20,
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
    "doctor": {
      "id": 1,
      "name": "医生1"
    },
    "date": "2023-01-02",
    "start_time": "14:00",
    "end_time": "18:00",
    "max_patients": 20,
    "available_slots": 20,
    "status": "ACTIVE",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-02T00:00:00"
  }
}
```

### 6.4 删除排班

**接口路径**：`/schedules/{id}`
**请求方法**：DELETE
**权限要求**：ADMIN 或医生本人
**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 排班ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "删除成功",
  "data": null
}
```

## 7. 预约管理接口

### 7.1 获取预约列表

**接口路径**：`/appointments`
**请求方法**：GET
**查询参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| page | Integer | 否 | 页码，默认 1 |
| size | Integer | 否 | 每页数量，默认 10 |
| patient_id | Long | 否 | 患者ID筛选 |
| doctor_id | Long | 否 | 医生ID筛选 |
| status | String | 否 | 状态筛选 |
| start_date | String | 否 | 开始日期（格式：YYYY-MM-DD） |
| end_date | String | 否 | 结束日期（格式：YYYY-MM-DD） |

**响应示例**：

```json
{
  "code": 200,
  "message": "成功",
  "data": {
    "total": 50,
    "pages": 5,
    "current": 1,
    "records": [
      {
        "id": 1,
        "patient": {
          "id": 2,
          "name": "患者1"
        },
        "doctor": {
          "id": 1,
          "name": "医生1"
        },
        "appointment_time": "2023-01-01T08:30:00",
        "status": "CONFIRMED",
        "symptoms": "头痛",
        "created_at": "2023-01-01T00:00:00"
      }
    ]
  }
}
```

### 7.2 获取单个预约信息

**接口路径**：`/appointments/{id}`
**请求方法**：GET
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
    "patient": {
      "id": 2,
      "name": "患者1",
      "phone": "13900139000"
    },
    "doctor": {
      "id": 1,
      "name": "医生1",
      "department": "内科"
    },
    "schedule": {
      "id": 1,
      "date": "2023-01-01",
      "start_time": "08:00",
      "end_time": "12:00"
    },
    "appointment_time": "2023-01-01T08:30:00",
    "status": "CONFIRMED",
    "symptoms": "头痛",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 7.3 创建新预约

**接口路径**：`/appointments`
**请求方法**：POST
**权限要求**：PATIENT
**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| doctor_id | Long | 是 | 医生ID |
| schedule_id | Long | 是 | 排班ID |
| symptoms | String | 否 | 症状描述 |

**请求示例**：

```json
{
  "doctor_id": 1,
  "schedule_id": 1,
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
    "patient": {
      "id": 2,
      "name": "患者1"
    },
    "doctor": {
      "id": 1,
      "name": "医生1"
    },
    "schedule": {
      "id": 1,
      "date": "2023-01-01",
      "start_time": "08:00",
      "end_time": "12:00"
    },
    "appointment_time": "2023-01-01T09:00:00",
    "status": "PENDING",
    "symptoms": "头痛、头晕",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 7.4 更新预约状态

**接口路径**：`/appointments/{id}`
**请求方法**：PUT
**权限要求**：ADMIN、DOCTOR 或患者本人
**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 预约ID |

**请求参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| status | String | 是 | 状态（PENDING/CONFIRMED/COMPLETED/CANCELLED） |

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
    "patient": {
      "id": 2,
      "name": "患者1"
    },
    "doctor": {
      "id": 1,
      "name": "医生1"
    },
    "appointment_time": "2023-01-01T09:00:00",
    "status": "CONFIRMED",
    "symptoms": "头痛、头晕",
    "created_at": "2023-01-01T00:00:00",
    "updated_at": "2023-01-01T00:00:00"
  }
}
```

### 7.5 取消预约

**接口路径**：`/appointments/{id}`
**请求方法**：DELETE
**权限要求**：ADMIN、DOCTOR 或患者本人
**路径参数**：

| 参数名 | 类型 | 必填 | 描述 |
|--------|------|------|------|
| id | Long | 是 | 预约ID |

**响应示例**：

```json
{
  "code": 200,
  "message": "取消成功",
  "data": null
}
```

## 8. 错误码定义

| 错误码 | 描述 | 说明 |
|--------|------|------|
| 400 | 请求参数错误 | 输入参数格式不正确或缺少必要参数 |
| 401 | 未授权 | 未提供认证令牌或令牌无效 |
| 403 | 禁止访问 | 没有权限执行此操作 |
| 404 | 资源不存在 | 请求的资源不存在 |
| 405 | 方法不允许 | HTTP 方法不支持 |
| 500 | 服务器内部错误 | 服务器处理请求时发生错误 |
| 503 | 服务不可用 | 服务暂时不可用 |
| 1001 | 用户不存在 | 用户名或密码错误 |
| 1002 | 密码错误 | 密码不正确 |
| 1003 | 用户名已存在 | 用户名已被注册 |
| 1004 | 手机号码已存在 | 手机号码已被注册 |
| 1005 | 身份证号已存在 | 身份证号已被注册 |
| 1006 | 邮箱已存在 | 邮箱已被注册 |
| 2001 | 科室不存在 | 科室ID不存在 |
| 2002 | 科室名称已存在 | 科室名称已被使用 |
| 3001 | 医生不存在 | 医生ID不存在 |
| 3002 | 用户不是医生 | 该用户不是医生角色 |
| 4001 | 排班不存在 | 排班ID不存在 |
| 4002 | 排班已取消 | 该排班已被取消 |
| 4003 | 排班已满 | 该排班的预约人数已达上限 |
| 5001 | 预约不存在 | 预约ID不存在 |
| 5002 | 预约已完成 | 该预约已完成，无法操作 |
| 5003 | 预约已取消 | 该预约已取消，无法操作 |
| 5004 | 预约时间已过 | 预约时间已过，无法操作 |
