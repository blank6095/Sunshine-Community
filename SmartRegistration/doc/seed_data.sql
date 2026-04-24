-- ====================================================================
-- 智能挂号预约系统 - 测试数据填充脚本
-- ====================================================================
-- 数据库: smart_registration_db
-- 版本: 1.0
-- 创建日期: 2026-04-24
-- 说明: 
--   1. 为系统填充基础测试数据（科室、用户、医生、排班、预约）
--   2. 确保医生用户和管理员用户不会被分配任何预约订单
--   3. 仅普通患者用户（PATIENT角色）会有预约记录
--   4. 使用事务保证数据一致性
-- ====================================================================

-- 开启事务，确保数据一致性
START TRANSACTION;

-- ====================================================================
-- 第一部分：清理现有测试数据（可选，按需执行）
-- ====================================================================
-- 说明：如需完全重置数据，取消以下注释
-- 注意：按依赖关系从子表到父表顺序删除

-- DELETE FROM appointments;
-- DELETE FROM schedules;
-- DELETE FROM doctors;
-- DELETE FROM departments;
-- DELETE FROM users;

-- 重置自增ID计数器
-- ALTER TABLE appointments AUTO_INCREMENT = 1;
-- ALTER TABLE schedules AUTO_INCREMENT = 1;
-- ALTER TABLE doctors AUTO_INCREMENT = 1;
-- ALTER TABLE departments AUTO_INCREMENT = 1;
-- ALTER TABLE users AUTO_INCREMENT = 1;

-- ====================================================================
-- 第二部分：插入科室数据
-- ====================================================================
-- 说明：创建6个常见科室，状态均为ACTIVE

INSERT INTO departments (name, description, status, created_at, updated_at) VALUES
('内科', '内科科室，负责诊断和治疗内脏器官疾病', 'ACTIVE', NOW(), NOW()),
('外科', '外科科室，负责手术治疗', 'ACTIVE', NOW(), NOW()),
('儿科', '儿科科室，专门负责儿童疾病诊治', 'ACTIVE', NOW(), NOW()),
('妇产科', '妇产科科室，负责妇女和孕产妇健康', 'ACTIVE', NOW(), NOW()),
('骨科', '骨科科室，负责骨骼和关节疾病治疗', 'ACTIVE', NOW(), NOW()),
('眼科', '眼科科室，专门负责眼部疾病诊治', 'ACTIVE', NOW(), NOW());

-- ====================================================================
-- 第三部分：插入用户数据
-- ====================================================================
-- 说明：
--   - 管理员用户（ADMIN）：1个
--   - 医生用户（DOCTOR）：4个
--   - 患者用户（PATIENT）：5个
-- 注意：
--   - 密码统一为123456的BCrypt加密值
--   - 医生和管理员用户不会有任何预约记录

-- 管理员用户（1个）
INSERT INTO users (username, password, name, gender, age, phone, email, id_card, role, status, created_at, updated_at) VALUES
('admin', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '系统管理员', '男', 35, '13800000000', 'admin@hospital.com', '110101199001010001', 'ADMIN', 'ACTIVE', NOW(), NOW());

-- 医生用户（4个）- 这些用户后续会被关联到医生表，但不会有预约
INSERT INTO users (username, password, name, gender, age, phone, email, id_card, role, status, created_at, updated_at) VALUES
('doctor_zhang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '张伟', '男', 45, '13800000001', 'zhangwei@hospital.com', '110101198001010001', 'DOCTOR', 'ACTIVE', NOW(), NOW()),
('doctor_li', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '李娜', '女', 38, '13800000002', 'lina@hospital.com', '110101198801010002', 'DOCTOR', 'ACTIVE', NOW(), NOW()),
('doctor_wang', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '王强', '男', 42, '13800000003', 'wangqiang@hospital.com', '110101198401010003', 'DOCTOR', 'ACTIVE', NOW(), NOW()),
('doctor_chen', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '陈芳', '女', 40, '13800000004', 'chenfang@hospital.com', '110101198601010004', 'DOCTOR', 'ACTIVE', NOW(), NOW());

-- 患者用户（5个）- 这些用户会有预约记录
INSERT INTO users (username, password, name, gender, age, phone, email, id_card, role, status, created_at, updated_at) VALUES
('patient001', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '赵明', '男', 28, '13900000001', 'zhaoming@example.com', '110101199801010001', 'PATIENT', 'ACTIVE', NOW(), NOW()),
('patient002', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '孙丽', '女', 32, '13900000002', 'sunli@example.com', '110101199401010002', 'PATIENT', 'ACTIVE', NOW(), NOW()),
('patient003', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '周杰', '男', 45, '13900000003', 'zhoujie@example.com', '110101198101010003', 'PATIENT', 'ACTIVE', NOW(), NOW()),
('patient004', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '吴芳', '女', 26, '13900000004', 'wufang@example.com', '110101199001010004', 'PATIENT', 'ACTIVE', NOW(), NOW()),
('patient005', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '郑华', '男', 50, '13900000005', 'zhenghua@example.com', '110101197601010005', 'PATIENT', 'ACTIVE', NOW(), NOW());

-- ====================================================================
-- 第四部分：插入医生数据
-- ====================================================================
-- 说明：
--   - 将DOCTOR角色的用户关联到医生表
--   - 指定所属科室、职称、专长等信息
-- 注意：这些医生对应的用户（user_id 2-5）不会有任何预约记录

-- 医生1：张伟 - 内科主任医师
INSERT INTO doctors (user_id, department_id, title, specialty, bio, status, created_at, updated_at) VALUES
(2, 1, '主任医师', '心血管疾病', '从事心血管疾病诊疗工作20年，擅长高血压、冠心病等心血管疾病诊治', 'ACTIVE', NOW(), NOW());

-- 医生2：李娜 - 儿科副主任医师
INSERT INTO doctors (user_id, department_id, title, specialty, bio, status, created_at, updated_at) VALUES
(3, 3, '副主任医师', '儿童呼吸系统疾病', '从事儿科临床工作15年，擅长儿童哮喘、支气管炎等呼吸系统疾病诊治', 'ACTIVE', NOW(), NOW());

-- 医生3：王强 - 外科主治医师
INSERT INTO doctors (user_id, department_id, title, specialty, bio, status, created_at, updated_at) VALUES
(4, 2, '主治医师', '普外科手术', '从事普外科临床工作12年，擅长阑尾炎、胆囊炎等常见外科手术', 'ACTIVE', NOW(), NOW());

-- 医生4：陈芳 - 妇产科主任医师
INSERT INTO doctors (user_id, department_id, title, specialty, bio, status, created_at, updated_at) VALUES
(5, 4, '主任医师', '产科高危妊娠', '从事妇产科临床工作18年，擅长高危妊娠管理和产科危急重症处理', 'ACTIVE', NOW(), NOW());

-- ====================================================================
-- 第五部分：插入排班数据
-- ====================================================================
-- 说明：
--   - 为每位医生创建未来7天的排班
--   - 排班状态均为ACTIVE
--   - 设置不同的最大预约人数和可用预约数
-- 注意：日期使用当前日期+偏移量，确保排班在未来

-- 医生1（张伟）的排班 - 内科
INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status, created_at, updated_at) VALUES
(1, CURDATE() + INTERVAL 1 DAY, '08:00:00', '12:00:00', 20, 15, 'ACTIVE', NOW(), NOW()),
(1, CURDATE() + INTERVAL 2 DAY, '14:00:00', '18:00:00', 20, 20, 'ACTIVE', NOW(), NOW()),
(1, CURDATE() + INTERVAL 4 DAY, '08:00:00', '12:00:00', 20, 18, 'ACTIVE', NOW(), NOW());

-- 医生2（李娜）的排班 - 儿科
INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status, created_at, updated_at) VALUES
(2, CURDATE() + INTERVAL 1 DAY, '09:00:00', '12:00:00', 15, 10, 'ACTIVE', NOW(), NOW()),
(2, CURDATE() + INTERVAL 3 DAY, '14:00:00', '17:00:00', 15, 15, 'ACTIVE', NOW(), NOW()),
(2, CURDATE() + INTERVAL 5 DAY, '09:00:00', '12:00:00', 15, 12, 'ACTIVE', NOW(), NOW());

-- 医生3（王强）的排班 - 外科
INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status, created_at, updated_at) VALUES
(3, CURDATE() + INTERVAL 2 DAY, '08:00:00', '11:00:00', 10, 8, 'ACTIVE', NOW(), NOW()),
(3, CURDATE() + INTERVAL 4 DAY, '14:00:00', '17:00:00', 10, 10, 'ACTIVE', NOW(), NOW()),
(3, CURDATE() + INTERVAL 6 DAY, '08:00:00', '11:00:00', 10, 6, 'ACTIVE', NOW(), NOW());

-- 医生4（陈芳）的排班 - 妇产科
INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status, created_at, updated_at) VALUES
(4, CURDATE() + INTERVAL 1 DAY, '14:00:00', '17:00:00', 12, 9, 'ACTIVE', NOW(), NOW()),
(4, CURDATE() + INTERVAL 3 DAY, '08:00:00', '12:00:00', 12, 12, 'ACTIVE', NOW(), NOW()),
(4, CURDATE() + INTERVAL 5 DAY, '14:00:00', '17:00:00', 12, 7, 'ACTIVE', NOW(), NOW());

-- ====================================================================
-- 第六部分：插入预约数据
-- ====================================================================
-- 说明：
--   - 仅为患者用户（PATIENT角色，user_id 6-10）创建预约
--   - 确保医生用户（user_id 2-5）和管理员用户（user_id 1）没有任何预约记录
--   - 预约状态包括：PENDING（待确认）、CONFIRMED（已确认）、COMPLETED（已完成）、CANCELLED（已取消）
--   - 预约时间对应排班时间范围内

-- 患者1（赵明）的预约 - 预约医生1（张伟）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(6, 1, 1, CURDATE() + INTERVAL 1 DAY + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 'CONFIRMED', '头痛、头晕，持续3天', NOW(), NOW());

-- 患者2（孙丽）的预约 - 预约医生2（李娜）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(7, 2, 4, CURDATE() + INTERVAL 1 DAY + INTERVAL 9 HOUR + INTERVAL 30 MINUTE, 'PENDING', '孩子咳嗽、发烧38.5度', NOW(), NOW());

-- 患者3（周杰）的预约 - 预约医生3（王强）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(8, 3, 7, CURDATE() + INTERVAL 2 DAY + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 'CONFIRMED', '腹部疼痛，怀疑阑尾炎', NOW(), NOW());

-- 患者4（吴芳）的预约 - 预约医生4（陈芳）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(9, 4, 10, CURDATE() + INTERVAL 1 DAY + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 'PENDING', '孕24周常规产检', NOW(), NOW());

-- 患者5（郑华）的预约 - 预约医生1（张伟）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(10, 1, 2, CURDATE() + INTERVAL 2 DAY + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 'CONFIRMED', '胸闷、心悸，高血压病史10年', NOW(), NOW());

-- 患者1（赵明）的第二个预约 - 预约医生2（李娜）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(6, 2, 5, CURDATE() + INTERVAL 3 DAY + INTERVAL 14 HOUR + INTERVAL 30 MINUTE, 'PENDING', '孩子反复咳嗽2周未愈', NOW(), NOW());

-- 患者3（周杰）的第二个预约 - 预约医生1（张伟）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(8, 1, 3, CURDATE() + INTERVAL 4 DAY + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 'COMPLETED', '高血压复诊，药物调整', NOW(), NOW());

-- 患者2（孙丽）的第二个预约 - 预约医生4（陈芳）
INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES
(7, 4, 11, CURDATE() + INTERVAL 3 DAY + INTERVAL 8 HOUR + INTERVAL 30 MINUTE, 'CANCELLED', '孕12周首次产检（已取消）', NOW(), NOW());

-- ====================================================================
-- 第七部分：数据验证查询
-- ====================================================================
-- 说明：以下查询用于验证数据填充是否正确
-- 注意：验证完成后请删除或注释掉这些查询语句

-- 验证1：检查各角色用户数量
-- SELECT role, COUNT(*) as user_count FROM users GROUP BY role;

-- 验证2：检查医生用户是否没有任何预约（应该返回0条记录）
-- SELECT u.username, u.name, u.role, COUNT(a.id) as appointment_count
-- FROM users u
-- LEFT JOIN appointments a ON u.id = a.patient_id
-- WHERE u.role IN ('ADMIN', 'DOCTOR')
-- GROUP BY u.id, u.username, u.name, u.role
-- HAVING appointment_count > 0;

-- 验证3：检查所有预约的患者是否都是PATIENT角色（应该返回所有预约）
-- SELECT a.id as appointment_id, u.username, u.name, u.role, a.status
-- FROM appointments a
-- JOIN users u ON a.patient_id = u.id
-- WHERE u.role = 'PATIENT';

-- 验证4：统计各状态预约数量
-- SELECT status, COUNT(*) as count FROM appointments GROUP BY status;

-- 验证5：统计每位医生的预约数量
-- SELECT d.id as doctor_id, u.name as doctor_name, COUNT(a.id) as appointment_count
-- FROM doctors d
-- JOIN users u ON d.user_id = u.id
-- LEFT JOIN appointments a ON d.id = a.doctor_id
-- GROUP BY d.id, u.name;

-- ====================================================================
-- 第八部分：提交事务
-- ====================================================================
-- 如果所有数据插入成功，提交事务
COMMIT;

-- 如果出现错误，回滚事务（取消以下注释）
-- ROLLBACK;

-- ====================================================================
-- 脚本执行说明
-- ====================================================================
-- 1. 执行方式：
--    mysql -u root -p smart_registration_db < seed_data.sql
--
-- 2. 数据概览：
--    - 科室：6个（内科、外科、儿科、妇产科、骨科、眼科）
--    - 用户：10个（1管理员 + 4医生 + 5患者）
--    - 医生：4个（分别属于内科、儿科、外科、妇产科）
--    - 排班：12个（每位医生3个排班）
--    - 预约：8个（全部属于5位患者，医生和管理员无预约）
--
-- 3. 角色约束验证：
--    - 管理员（user_id=1）：无预约
--    - 医生用户（user_id=2-5）：无预约
--    - 患者用户（user_id=6-10）：有预约
--
-- 4. 密码说明：
--    - 所有用户密码均为：123456
--    - BCrypt哈希值：$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
--
-- 5. 注意事项：
--    - 执行前请备份现有数据
--    - 如需重置数据，取消第二部分的DELETE语句注释
--    - 验证查询仅用于调试，生产环境请删除
-- ====================================================================
