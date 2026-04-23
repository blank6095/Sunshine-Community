
-- 智能挂号预约系统初始数据脚本
USE smart_registration_db;

-- 1. 插入管理员用户
INSERT INTO users (username, password, name, gender, age, phone, email, role, status) VALUES
('admin', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '管理员', '男', 30, '13800138000', 'admin@example.com', 'ADMIN', 'ACTIVE');

-- 2. 插入科室数据
INSERT INTO departments (name, description, status) VALUES
('内科', '负责诊治内脏疾病', 'ACTIVE'),
('外科', '负责手术治疗', 'ACTIVE'),
('儿科', '负责儿童疾病诊治', 'ACTIVE'),
('妇产科', '负责女性生殖系统疾病诊治', 'ACTIVE'),
('眼科', '负责眼部疾病诊治', 'ACTIVE'),
('口腔科', '负责口腔疾病诊治', 'ACTIVE'),
('皮肤科', '负责皮肤疾病诊治', 'ACTIVE'),
('精神科', '负责精神疾病诊治', 'ACTIVE');

-- 3. 插入医生用户
INSERT INTO users (username, password, name, gender, age, phone, email, role, status) VALUES
('doctor1', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '张医生', '男', 45, '13800138001', 'doctor1@example.com', 'DOCTOR', 'ACTIVE'),
('doctor2', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '李医生', '女', 38, '13800138002', 'doctor2@example.com', 'DOCTOR', 'ACTIVE'),
('doctor3', '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36WQoeG6Lruj3vjPGga31lW', '王医生', '男', 50, '13800138003', 'doctor3@example.com', 'DOCTOR', 'ACTIVE');

-- 4. 插入医生信息
INSERT INTO doctors (user_id, department_id, title, specialty, bio, status) VALUES
(2, 1, '主任医师', '心血管疾病', '从事内科临床工作20年，擅长心血管疾病的诊断和治疗', 'ACTIVE'),
(3, 2, '副主任医师', '普外科', '从事外科临床工作15年，擅长普外科手术', 'ACTIVE'),
(4, 3, '主治医师', '小儿内科', '从事儿科临床工作10年，擅长小儿常见病的诊治', 'ACTIVE');

-- 5. 插入排班数据
INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status) VALUES
(1, '2026-04-24', '08:00:00', '12:00:00', 20, 20, 'ACTIVE'),
(1, '2026-04-25', '08:00:00', '12:00:00', 20, 20, 'ACTIVE'),
(2, '2026-04-24', '14:00:00', '18:00:00', 15, 15, 'ACTIVE'),
(2, '2026-04-26', '14:00:00', '18:00:00', 15, 15, 'ACTIVE'),
(3, '2026-04-25', '08:00:00', '12:00:00', 25, 25, 'ACTIVE'),
(3, '2026-04-27', '08:00:00', '12:00:00', 25, 25, 'ACTIVE');
