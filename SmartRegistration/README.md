# 智能挂号预约系统

## 项目简介

智能挂号预约系统是一个基于Spring Boot的现代化医疗预约管理系统，为医院、医生和患者提供便捷的挂号预约服务。

### 核心功能

- **用户认证**：基于JWT的身份验证系统
- **科室管理**：医院科室信息管理
- **医生管理**：医生信息和专业领域管理
- **排班管理**：医生排班和号源管理
- **预约管理**：患者预约挂号和状态管理
- **权限控制**：基于角色的访问控制
- **系统监控**：健康检查和日志管理

## 技术栈

- **后端框架**：Spring Boot 4.0.5
- **安全框架**：Spring Security 6.x
- **数据访问**：Spring Data JPA
- **数据库**：MySQL 8.0+
- **认证方案**：JWT (JSON Web Token)
- **API文档**：Swagger 3.0
- **构建工具**：Maven
- **开发语言**：Java 17+

## 系统架构

系统采用分层架构设计：

- **控制器层**：处理HTTP请求和响应
- **服务层**：实现业务逻辑
- **数据访问层**：与数据库交互
- **模型层**：定义数据结构
- **安全层**：处理认证和授权
- **中间件**：实现横切关注点

## 目录结构

```
SmartRegistration/
├── doc/                # 项目文档
├── logs/               # 日志文件
├── sql/                # SQL脚本
├── src/                # 源代码
│   ├── main/java/      # Java源码
│   └── main/resources/ # 配置文件
├── .gitignore         # Git忽略文件
├── pom.xml            # Maven配置
└── README.md          # 项目说明
```

## 快速开始

### 环境要求

- JDK 17+
- MySQL 8.0+
- Maven 3.6+

### 安装步骤

1. **克隆项目**
   ```bash
   git clone https://github.com/your-repo/smart-registration.git
   cd smart-registration
   ```

2. **配置数据库**
   ```bash
   # 创建数据库
   mysql -u root -p
   CREATE DATABASE smart_registration_db;
   
   # 导入SQL脚本
   mysql -u root -p smart_registration_db < sql/init.sql
   mysql -u root -p smart_registration_db < sql/data.sql
   ```

3. **配置应用**
   编辑 `src/main/resources/application.yml` 文件，配置数据库连接信息。

4. **构建项目**
   ```bash
   ./mvnw clean package
   ```

5. **运行应用**
   ```bash
   java -jar target/blank-0.0.1-SNAPSHOT.jar
   ```

### 访问地址

- **应用地址**：http://localhost:8080/api/v1
- **Swagger文档**：http://localhost:8080/api/v1/swagger-ui.html
- **健康检查**：http://localhost:8080/api/v1/health

## 核心模块

### 1. 认证模块
- **登录**：`POST /auth/login`
- **注册**：`POST /auth/register`
- **刷新令牌**：`POST /auth/refresh`

### 2. 科室模块
- **获取科室列表**：`GET /departments`
- **获取科室详情**：`GET /departments/{id}`
- **创建科室**：`POST /departments`
- **更新科室**：`PUT /departments/{id}`
- **删除科室**：`DELETE /departments/{id}`

### 3. 医生模块
- **获取医生列表**：`GET /doctors`
- **获取医生详情**：`GET /doctors/{id}`
- **创建医生**：`POST /doctors`
- **更新医生**：`PUT /doctors/{id}`
- **删除医生**：`DELETE /doctors/{id}`
- **获取医生排班**：`GET /doctors/{id}/schedules`

### 4. 排班模块
- **获取排班列表**：`GET /schedules`
- **获取排班详情**：`GET /schedules/{id}`
- **创建排班**：`POST /schedules`
- **更新排班**：`PUT /schedules/{id}`
- **删除排班**：`DELETE /schedules/{id}`
- **获取科室排班**：`GET /schedules/department/{departmentId}`
- **获取医生排班**：`GET /schedules/doctor/{doctorId}`

### 5. 预约模块
- **获取预约列表**：`GET /appointments`
- **获取预约详情**：`GET /appointments/{id}`
- **创建预约**：`POST /appointments`
- **更新预约**：`PUT /appointments/{id}`
- **取消预约**：`PUT /appointments/{id}/cancel`
- **完成预约**：`PUT /appointments/{id}/complete`
- **获取患者预约**：`GET /appointments/patient/{patientId}`
- **获取医生预约**：`GET /appointments/doctor/{doctorId}`

## 安全配置

系统使用基于JWT的认证机制，需要在请求头中添加：

```
Authorization: Bearer {token}
```

### 角色权限

- **ADMIN**：管理员，拥有所有权限
- **DOCTOR**：医生，可管理自己的排班和查看患者预约
- **PATIENT**：患者，可预约和查看自己的预约记录

## 配置管理

系统支持多环境配置：

- **开发环境**：`application-dev.properties`
- **测试环境**：`application-test.properties`
- **生产环境**：`application-prod.properties`

## 日志管理

日志文件存储在 `logs/` 目录，包括：
- 系统运行日志
- 访问日志
- 错误日志

## 维护指南

### 常见问题

1. **数据库连接失败**
   - 检查数据库服务是否运行
   - 验证数据库连接配置

2. **JWT令牌过期**
   - 使用刷新令牌获取新令牌
   - 检查JWT配置中的过期时间

3. **API访问权限**
   - 确保请求头中包含有效的JWT令牌
   - 验证用户角色权限

### 监控指标

- **系统健康**：`/health` 端点
- **API响应时间**：日志中记录
- **错误率**：监控日志中的错误信息

## 贡献指南

1. **代码规范**：遵循项目编码规范
2. **提交信息**：清晰描述变更内容
3. **测试**：确保代码通过测试
4. **文档**：更新相关文档

## 许可证

本项目采用 Apache 2.0 许可证。

## 联系方式

- **项目维护**：技术团队
- **反馈邮箱**：tech@example.com
- **文档地址**：`doc/README.md`

---

*项目版本：1.0.0*
*最后更新：2026-04-23*
