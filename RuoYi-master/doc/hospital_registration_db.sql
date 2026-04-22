-- 医院挂号系统数据库设计

-- 1. 科室信息表
CREATE TABLE `department_info` (
  `dept_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '科室ID',
  `dept_name` VARCHAR(50) NOT NULL COMMENT '科室名称',
  `dept_code` VARCHAR(20) NOT NULL COMMENT '科室编码',
  `dept_desc` VARCHAR(255) DEFAULT NULL COMMENT '科室描述',
  `status` CHAR(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`dept_id`),
  UNIQUE KEY `uk_dept_code` (`dept_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='科室信息表';

-- 2. 医生信息表
CREATE TABLE `doctor_info` (
  `doctor_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '医生ID',
  `doctor_name` VARCHAR(50) NOT NULL COMMENT '医生姓名',
  `doctor_code` VARCHAR(20) NOT NULL COMMENT '医生编码',
  `dept_id` BIGINT(20) NOT NULL COMMENT '所属科室ID',
  `title` VARCHAR(50) DEFAULT NULL COMMENT '职称',
  `specialty` VARCHAR(100) DEFAULT NULL COMMENT '专业特长',
  `avatar` VARCHAR(255) DEFAULT NULL COMMENT '头像',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '联系电话',
  `status` CHAR(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`doctor_id`),
  UNIQUE KEY `uk_doctor_code` (`doctor_code`),
  KEY `idx_dept_id` (`dept_id`),
  CONSTRAINT `fk_doctor_dept` FOREIGN KEY (`dept_id`) REFERENCES `department_info` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='医生信息表';

-- 3. 患者信息表
CREATE TABLE `patient_info` (
  `patient_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '患者ID',
  `patient_name` VARCHAR(50) NOT NULL COMMENT '患者姓名',
  `id_card` VARCHAR(18) NOT NULL COMMENT '身份证号',
  `phone` VARCHAR(20) NOT NULL COMMENT '联系电话',
  `gender` CHAR(1) DEFAULT NULL COMMENT '性别（0男 1女）',
  `birth_date` DATE DEFAULT NULL COMMENT '出生日期',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '地址',
  `status` CHAR(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`patient_id`),
  UNIQUE KEY `uk_id_card` (`id_card`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='患者信息表';

-- 4. 挂号时间表
CREATE TABLE `registration_schedule` (
  `schedule_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '排班ID',
  `doctor_id` BIGINT(20) NOT NULL COMMENT '医生ID',
  `dept_id` BIGINT(20) NOT NULL COMMENT '科室ID',
  `schedule_date` DATE NOT NULL COMMENT '排班日期',
  `morning_available` INT(11) DEFAULT 0 COMMENT '上午可挂号数',
  `afternoon_available` INT(11) DEFAULT 0 COMMENT '下午可挂号数',
  `morning_total` INT(11) DEFAULT 0 COMMENT '上午总号数',
  `afternoon_total` INT(11) DEFAULT 0 COMMENT '下午总号数',
  `status` CHAR(1) DEFAULT '0' COMMENT '状态（0正常 1停用）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`schedule_id`),
  KEY `idx_doctor_id` (`doctor_id`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_schedule_date` (`schedule_date`),
  CONSTRAINT `fk_schedule_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_info` (`doctor_id`),
  CONSTRAINT `fk_schedule_dept` FOREIGN KEY (`dept_id`) REFERENCES `department_info` (`dept_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='挂号时间表';

-- 5. 预约记录表
CREATE TABLE `appointment_record` (
  `appointment_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '预约ID',
  `patient_id` BIGINT(20) NOT NULL COMMENT '患者ID',
  `doctor_id` BIGINT(20) NOT NULL COMMENT '医生ID',
  `dept_id` BIGINT(20) NOT NULL COMMENT '科室ID',
  `schedule_id` BIGINT(20) NOT NULL COMMENT '排班ID',
  `appointment_date` DATE NOT NULL COMMENT '预约日期',
  `appointment_time` CHAR(1) NOT NULL COMMENT '预约时段（0上午 1下午）',
  `registration_no` VARCHAR(30) NOT NULL COMMENT '挂号编号',
  `status` CHAR(1) DEFAULT '0' COMMENT '状态（0待就诊 1已就诊 2已取消）',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `update_time` DATETIME DEFAULT NULL COMMENT '更新时间',
  PRIMARY KEY (`appointment_id`),
  UNIQUE KEY `uk_registration_no` (`registration_no`),
  KEY `idx_patient_id` (`patient_id`),
  KEY `idx_doctor_id` (`doctor_id`),
  KEY `idx_dept_id` (`dept_id`),
  KEY `idx_schedule_id` (`schedule_id`),
  CONSTRAINT `fk_appointment_patient` FOREIGN KEY (`patient_id`) REFERENCES `patient_info` (`patient_id`),
  CONSTRAINT `fk_appointment_doctor` FOREIGN KEY (`doctor_id`) REFERENCES `doctor_info` (`doctor_id`),
  CONSTRAINT `fk_appointment_dept` FOREIGN KEY (`dept_id`) REFERENCES `department_info` (`dept_id`),
  CONSTRAINT `fk_appointment_schedule` FOREIGN KEY (`schedule_id`) REFERENCES `registration_schedule` (`schedule_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='预约记录表';

-- 6. 系统用户表（扩展若依框架的用户表）
-- 注意：若依框架已有sys_user表，这里只需要添加角色和权限配置

-- 初始化数据
-- 科室数据
INSERT INTO `department_info` (`dept_name`, `dept_code`, `dept_desc`) VALUES
('内科', 'NEIKE', '内科科室'),
('外科', 'WAIKE', '外科科室'),
('儿科', 'ERKE', '儿科科室'),
('妇产科', 'Fuchanke', '妇产科科室'),
('眼科', 'YANKE', '眼科科室');

-- 医生数据
INSERT INTO `doctor_info` (`doctor_name`, `doctor_code`, `dept_id`, `title`, `specialty`) VALUES
('张医生', 'DOC001', 1, '主任医师', '心血管疾病'),
('李医生', 'DOC002', 1, '副主任医师', '消化系统疾病'),
('王医生', 'DOC003', 2, '主任医师', '普外科'),
('赵医生', 'DOC004', 3, '主治医师', '小儿内科'),
('钱医生', 'DOC005', 4, '主任医师', '妇产科');

-- 患者数据
INSERT INTO `patient_info` (`patient_name`, `id_card`, `phone`, `gender`, `birth_date`) VALUES
('张三', '110101199001011234', '13800138000', '0', '1990-01-01'),
('李四', '110101199002022345', '13900139000', '1', '1990-02-02'),
('王五', '110101199003033456', '13700137000', '0', '1990-03-03');

-- 挂号时间表数据
INSERT INTO `registration_schedule` (`doctor_id`, `dept_id`, `schedule_date`, `morning_available`, `afternoon_available`, `morning_total`, `afternoon_total`) VALUES
(1, 1, CURDATE(), 10, 10, 20, 20),
(2, 1, CURDATE(), 10, 10, 20, 20),
(3, 2, CURDATE(), 10, 10, 20, 20),
(4, 3, CURDATE(), 10, 10, 20, 20),
(5, 4, CURDATE(), 10, 10, 20, 20);