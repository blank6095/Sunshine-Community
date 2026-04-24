
-- ====================================================================
-- 智能挂号预约系统 - 高性能批量数据填充脚本
-- ====================================================================
-- 数据库: smart_registration_db
-- 版本: 2.0
-- 创建日期: 2026-04-24
-- 说明:
--   1. 使用存储过程和批量插入机制填充大量测试数据
--   2. 支持自定义数据量参数
--   3. 确保医生和管理员用户不会被分配预约
--   4. 分批提交避免大事务导致性能问题
--   5. 提供执行进度日志输出
--   6. 数据符合业务规则和字段约束
-- ====================================================================

-- ====================================================================
-- 参数配置区（执行前修改这些值）
-- ====================================================================
-- 配置变量
SET @USER_PATIENT_COUNT = 500;       -- 患者用户数量
SET @USER_DOCTOR_COUNT = 20;         -- 医生用户数量
SET @SCHEDULES_PER_DOCTOR = 8;       -- 每位医生的排班数
SET @APPOINTMENTS_PER_PATIENT = 2;   -- 每位患者的预约数
SET @BATCH_SIZE = 100;               -- 批量插入大小（建议50-200）
SET @CLEAN_EXISTING = 0;             -- 是否清理现有数据（1=清理，0=保留）

-- ====================================================================
-- 开始执行
-- ====================================================================
SELECT '========================================' AS '';
SELECT '智能挂号预约系统 - 批量数据填充' AS '';
SELECT CONCAT('执行时间: ', NOW()) AS '';
SELECT '========================================' AS '';

-- ====================================================================
-- 步骤1：创建辅助存储过程
-- ====================================================================
DROP PROCEDURE IF EXISTS batch_fill_data;

DELIMITER //

CREATE PROCEDURE batch_fill_data()
BEGIN
    -- 变量声明（必须在最前面）
    DECLARE v_dept_count INT DEFAULT 0;
    DECLARE v_doctor_count INT DEFAULT 0;
    DECLARE v_patient_count INT DEFAULT 0;
    DECLARE v_schedule_count INT DEFAULT 0;
    DECLARE v_appointment_count INT DEFAULT 0;
    
    DECLARE v_i INT DEFAULT 0;
    DECLARE v_j INT DEFAULT 0;
    DECLARE v_k INT DEFAULT 0;
    DECLARE v_batch INT DEFAULT 0;
    
    DECLARE v_doctor_id BIGINT;
    DECLARE v_patient_id BIGINT;
    DECLARE v_schedule_id BIGINT;
    DECLARE v_dept_id BIGINT;
    
    DECLARE v_gender VARCHAR(10);
    DECLARE v_age INT;
    DECLARE v_role VARCHAR(20);
    DECLARE v_username VARCHAR(100);
    DECLARE v_name VARCHAR(100);
    DECLARE v_phone VARCHAR(20);
    DECLARE v_email VARCHAR(100);
    DECLARE v_id_card VARCHAR(18);
    DECLARE v_title VARCHAR(50);
    DECLARE v_specialty VARCHAR(100);
    DECLARE v_bio VARCHAR(255);
    DECLARE v_description VARCHAR(255);
    DECLARE v_symptoms VARCHAR(255);
    DECLARE v_status VARCHAR(20);
    DECLARE v_appt_status VARCHAR(20);
    
    DECLARE v_schedule_date DATE;
    DECLARE v_start_time TIME;
    DECLARE v_end_time TIME;
    DECLARE v_max_patients INT;
    DECLARE v_available_slots INT;
    DECLARE v_appointment_time DATETIME;
    
    DECLARE v_total_doctors_needed INT;
    DECLARE v_total_patients_needed INT;
    DECLARE v_start_time_log DATETIME;
    DECLARE v_end_time_log DATETIME;
    DECLARE v_elapsed DECIMAL(10,2);
    
    DECLARE done INT DEFAULT 0;
    
    -- 游标声明
    DECLARE cur_doctor_ids CURSOR FOR SELECT d.id FROM doctors d ORDER BY d.id;
    DECLARE cur_patient_ids CURSOR FOR SELECT u.id FROM users u WHERE u.role = 'PATIENT' ORDER BY u.id;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    -- 记录开始时间
    SET v_start_time_log = NOW();
    SELECT CONCAT('>>> 开始执行: ', v_start_time_log) AS '';
    
    -- ==============================
    -- 步骤1：清理现有数据（可选）
    -- ==============================
    IF @CLEAN_EXISTING = 1 THEN
        SELECT '--- 清理现有数据...' AS '';
        DELETE FROM appointments;
        DELETE FROM schedules;
        DELETE FROM doctors;
        DELETE FROM users WHERE username != 'admin';
        ALTER TABLE appointments AUTO_INCREMENT = 1;
        ALTER TABLE schedules AUTO_INCREMENT = 1;
        ALTER TABLE doctors AUTO_INCREMENT = 1;
        ALTER TABLE users AUTO_INCREMENT = 2;
        SELECT '--- 数据清理完成' AS '';
    END IF;
    
    -- ==============================
    -- 步骤2：插入科室数据
    -- ==============================
    SELECT '--- 插入科室数据...' AS '';
    SET v_dept_count = (SELECT COUNT(*) FROM departments);
    
    IF v_dept_count = 0 THEN
        INSERT INTO departments (name, description, status, created_at, updated_at) VALUES
        ('内科', '内科科室，负责诊断和治疗内脏器官疾病', 'ACTIVE', NOW(), NOW()),
        ('外科', '外科科室，负责手术治疗', 'ACTIVE', NOW(), NOW()),
        ('儿科', '儿科科室，专门负责儿童疾病诊治', 'ACTIVE', NOW(), NOW()),
        ('妇产科', '妇产科科室，负责妇女和孕产妇健康', 'ACTIVE', NOW(), NOW()),
        ('骨科', '骨科科室，负责骨骼和关节疾病治疗', 'ACTIVE', NOW(), NOW()),
        ('眼科', '眼科科室，专门负责眼部疾病诊治', 'ACTIVE', NOW(), NOW()),
        ('神经内科', '神经内科，负责神经系统疾病诊治', 'ACTIVE', NOW(), NOW()),
        ('皮肤科', '皮肤科，负责皮肤病诊治', 'ACTIVE', NOW(), NOW()),
        ('口腔科', '口腔科，负责口腔疾病诊治', 'ACTIVE', NOW(), NOW()),
        ('耳鼻喉科', '耳鼻喉科，负责耳鼻喉疾病诊治', 'ACTIVE', NOW(), NOW());
        
        SET v_dept_count = 10;
        SELECT CONCAT('--- 科室插入完成: ', v_dept_count, '个') AS '';
    ELSE
        SELECT CONCAT('--- 科室已存在: ', v_dept_count, '个') AS '';
    END IF;
    
    -- ==============================
    -- 步骤3：插入医生用户和医生数据
    -- ==============================
    SELECT '--- 插入医生数据...' AS '';
    SET v_doctor_count = (SELECT COUNT(*) FROM doctors);
    SET v_total_doctors_needed = @USER_DOCTOR_COUNT;
    SET v_i = 0;
    SET v_batch = 0;
    SET @sql_doctor = '';
    
    WHILE v_i < v_total_doctors_needed DO
        SET v_i = v_i + 1;
        SET v_batch = v_batch + 1;
        
        -- 随机性别
        IF RAND() < 0.5 THEN
            SET v_gender = '男';
        ELSE
            SET v_gender = '女';
        END IF;
        
        -- 随机年龄25-60
        SET v_age = 25 + FLOOR(RAND() * 36);
        
        -- 随机职称
        SET v_title = ELT(1 + FLOOR(RAND() * 4), '主任医师', '副主任医师', '主治医师', '住院医师');
        
        -- 随机专长
        SET v_specialty = ELT(
            1 + FLOOR(RAND() * 8),
            '心血管疾病', '呼吸系统疾病', '消化系统疾病', '神经系统疾病',
            '内分泌疾病', '泌尿系统疾病', '骨科疾病', '皮肤疾病'
        );
        
        -- 随机科室
        SET v_dept_id = 1 + FLOOR(RAND() * v_dept_count);
        
        -- 构建SQL
        SET v_username = CONCAT('doc_', v_doctor_count + v_i);
        SET v_name = CONCAT('医生', v_doctor_count + v_i);
        SET v_phone = CONCAT('138', LPAD(v_doctor_count + v_i, 8, '0'));
        SET v_email = CONCAT('doc', v_doctor_count + v_i, '@hospital.com');
        SET v_id_card = CONCAT('110101', LPAD(1960 + FLOOR(RAND() * 30), 4, '0'), 
            LPAD(1 + FLOOR(RAND() * 12), 2, '0'), 
            LPAD(1 + FLOOR(RAND() * 28), 2, '0'),
            LPAD(v_i, 4, '0'));
        
        IF @sql_doctor = '' THEN
            SET @sql_doctor = 'INSERT INTO users (username, password, name, gender, age, phone, email, id_card, role, status, created_at, updated_at) VALUES ';
        ELSE
            SET @sql_doctor = CONCAT(@sql_doctor, ',');
        END IF;
        
        SET @sql_doctor = CONCAT(@sql_doctor, 
            '(', QUOTE(v_username), ',''$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'',',
            QUOTE(v_name), ',', QUOTE(v_gender), ',', v_age, ',',
            QUOTE(v_phone), ',', QUOTE(v_email), ',', QUOTE(v_id_card),
            ',''DOCTOR'',''ACTIVE'',NOW(),NOW())'
        );
        
        -- 批量执行
        IF v_batch >= @BATCH_SIZE THEN
            SET @sql_doctor = CONCAT(@sql_doctor, ';');
            PREPARE stmt FROM @sql_doctor;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
            SET v_batch = 0;
            SET @sql_doctor = '';
        END IF;
        
        -- 插入医生记录
        INSERT INTO doctors (user_id, department_id, title, specialty, bio, status, created_at, updated_at)
        SELECT u.id, v_dept_id, v_title, v_specialty,
            CONCAT('从事', v_specialty, '诊疗工作', 5 + FLOOR(RAND() * 25), '年'),
            'ACTIVE', NOW(), NOW()
        FROM users u WHERE u.username = v_username;
    END WHILE;
    
    -- 执行剩余
    IF @sql_doctor != '' THEN
        SET @sql_doctor = CONCAT(@sql_doctor, ';');
        PREPARE stmt FROM @sql_doctor;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SET v_doctor_count = (SELECT COUNT(*) FROM doctors);
    SELECT CONCAT('--- 医生数据插入完成: ', v_doctor_count, '个') AS '';
    
    -- ==============================
    -- 步骤4：插入患者用户
    -- ==============================
    SELECT '--- 插入患者数据...' AS '';
    SET v_patient_count = (SELECT COUNT(*) FROM users WHERE role = 'PATIENT');
    SET v_total_patients_needed = @USER_PATIENT_COUNT;
    SET v_i = 0;
    SET v_batch = 0;
    SET @sql_patient = '';
    
    WHILE v_i < v_total_patients_needed DO
        SET v_i = v_i + 1;
        SET v_batch = v_batch + 1;
        
        -- 随机性别
        IF RAND() < 0.5 THEN
            SET v_gender = '男';
        ELSE
            SET v_gender = '女';
        END IF;
        
        -- 随机年龄1-80
        SET v_age = 1 + FLOOR(RAND() * 80);
        
        SET v_username = CONCAT('pat_', v_patient_count + v_i);
        SET v_name = CONCAT('患者', v_patient_count + v_i);
        SET v_phone = CONCAT('139', LPAD(v_patient_count + v_i, 8, '0'));
        SET v_email = CONCAT('patient', v_patient_count + v_i, '@example.com');
        SET v_id_card = CONCAT('110101', LPAD(1944 + FLOOR(RAND() * 76), 4, '0'),
            LPAD(1 + FLOOR(RAND() * 12), 2, '0'),
            LPAD(1 + FLOOR(RAND() * 28), 2, '0'),
            LPAD(v_i, 4, '0'));
        
        IF @sql_patient = '' THEN
            SET @sql_patient = 'INSERT INTO users (username, password, name, gender, age, phone, email, id_card, role, status, created_at, updated_at) VALUES ';
        ELSE
            SET @sql_patient = CONCAT(@sql_patient, ',');
        END IF;
        
        SET @sql_patient = CONCAT(@sql_patient,
            '(', QUOTE(v_username), ',''$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy'',',
            QUOTE(v_name), ',', QUOTE(v_gender), ',', v_age, ',',
            QUOTE(v_phone), ',', QUOTE(v_email), ',', QUOTE(v_id_card),
            ',''PATIENT'',''ACTIVE'',NOW(),NOW())'
        );
        
        -- 批量执行
        IF v_batch >= @BATCH_SIZE THEN
            SET @sql_patient = CONCAT(@sql_patient, ';');
            PREPARE stmt FROM @sql_patient;
            EXECUTE stmt;
            DEALLOCATE PREPARE stmt;
            SET v_batch = 0;
            SET @sql_patient = '';
        END IF;
    END WHILE;
    
    -- 执行剩余
    IF @sql_patient != '' THEN
        SET @sql_patient = CONCAT(@sql_patient, ';');
        PREPARE stmt FROM @sql_patient;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SET v_patient_count = (SELECT COUNT(*) FROM users WHERE role = 'PATIENT');
    SELECT CONCAT('--- 患者数据插入完成: ', v_patient_count, '个') AS '';
    
    -- ==============================
    -- 步骤5：插入排班数据
    -- ==============================
    SELECT '--- 插入排班数据...' AS '';
    SET v_schedule_count = (SELECT COUNT(*) FROM schedules);
    SET v_i = 0;
    SET v_batch = 0;
    SET done = 0;
    SET @sql_schedule = '';
    
    OPEN cur_doctor_ids;
    
    doctor_loop: LOOP
        FETCH cur_doctor_ids INTO v_doctor_id;
        IF done THEN
            LEAVE doctor_loop;
        END IF;
        
        SET v_j = 0;
        WHILE v_j < @SCHEDULES_PER_DOCTOR DO
            SET v_i = v_i + 1;
            SET v_batch = v_batch + 1;
            SET v_j = v_j + 1;
            
            -- 未来1-30天
            SET v_schedule_date = CURDATE() + INTERVAL (1 + FLOOR(RAND() * 30)) DAY;
            SET v_start_time = ELT(1 + FLOOR(RAND() * 4), '08:00:00', '09:00:00', '14:00:00', '15:00:00');
            SET v_max_patients = 10 + FLOOR(RAND() * 21);
            SET v_available_slots = FLOOR(RAND() * (v_max_patients + 1));
            SET v_end_time = ADDTIME(v_start_time, SEC_TO_TIME((3 + FLOOR(RAND() * 2)) * 3600));
            
            IF @sql_schedule = '' THEN
                SET @sql_schedule = 'INSERT INTO schedules (doctor_id, date, start_time, end_time, max_patients, available_slots, status, created_at, updated_at) VALUES ';
            ELSE
                SET @sql_schedule = CONCAT(@sql_schedule, ',');
            END IF;
            
            SET @sql_schedule = CONCAT(@sql_schedule,
                '(', v_doctor_id, ',', QUOTE(v_schedule_date), ',', QUOTE(v_start_time), ',',
                QUOTE(v_end_time), ',', v_max_patients, ',', v_available_slots,
                ',''ACTIVE'',NOW(),NOW())'
            );
            
            IF v_batch >= @BATCH_SIZE THEN
                SET @sql_schedule = CONCAT(@sql_schedule, ';');
                PREPARE stmt FROM @sql_schedule;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
                SET v_batch = 0;
                SET @sql_schedule = '';
            END IF;
        END WHILE;
    END LOOP;
    
    CLOSE cur_doctor_ids;
    
    -- 执行剩余
    IF @sql_schedule != '' THEN
        SET @sql_schedule = CONCAT(@sql_schedule, ';');
        PREPARE stmt FROM @sql_schedule;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SET v_schedule_count = (SELECT COUNT(*) FROM schedules);
    SELECT CONCAT('--- 排班数据插入完成: ', v_schedule_count, '个') AS '';
    
    -- ==============================
    -- 步骤6：插入预约数据（仅患者）
    -- ==============================
    SELECT '--- 插入预约数据...' AS '';
    SET v_appointment_count = (SELECT COUNT(*) FROM appointments);
    SET v_i = 0;
    SET v_batch = 0;
    SET done = 0;
    SET @sql_appointment = '';
    
    OPEN cur_patient_ids;
    
    patient_loop: LOOP
        FETCH cur_patient_ids INTO v_patient_id;
        IF done THEN
            LEAVE patient_loop;
        END IF;
        
        SET v_j = 0;
        WHILE v_j < @APPOINTMENTS_PER_PATIENT DO
            SET v_i = v_i + 1;
            SET v_batch = v_batch + 1;
            SET v_j = v_j + 1;
            
            -- 选择可用排班
            SET v_schedule_id = NULL;
            SELECT s.id, s.doctor_id, s.date, s.start_time
            INTO v_schedule_id, v_doctor_id, v_schedule_date, v_start_time
            FROM schedules s
            WHERE s.available_slots > 0 AND s.status = 'ACTIVE' AND s.date >= CURDATE()
            ORDER BY RAND()
            LIMIT 1;
            
            IF v_schedule_id IS NULL THEN
                LEAVE patient_loop;
            END IF;
            
            -- 预约时间
            SET v_appointment_time = TIMESTAMP(v_schedule_date,
                ADDTIME(v_start_time, SEC_TO_TIME(FLOOR(RAND() * 7200))));
            
            -- 随机状态
            SET v_appt_status = CASE
                WHEN RAND() < 0.60 THEN 'PENDING'
                WHEN RAND() < 0.85 THEN 'CONFIRMED'
                WHEN RAND() < 0.95 THEN 'COMPLETED'
                ELSE 'CANCELLED'
            END;
            
            SET v_symptoms = ELT(
                1 + FLOOR(RAND() * 15),
                '头痛、头晕，持续3天',
                '咳嗽、发烧38.5度',
                '腹部疼痛，怀疑阑尾炎',
                '胸闷、心悸，高血压病史10年',
                '关节肿痛，活动受限',
                '皮肤瘙痒，出现红斑',
                '牙痛，牙龈肿胀',
                '咽喉痛，声音嘶哑',
                '腰痛，下肢麻木',
                '视力模糊，眼睛干涩',
                '孕24周常规产检',
                '孩子反复咳嗽2周未愈',
                '高血压复诊，药物调整',
                '糖尿病定期检查',
                '过敏性鼻炎发作'
            );
            
            IF @sql_appointment = '' THEN
                SET @sql_appointment = 'INSERT INTO appointments (patient_id, doctor_id, schedule_id, appointment_time, status, symptoms, created_at, updated_at) VALUES ';
            ELSE
                SET @sql_appointment = CONCAT(@sql_appointment, ',');
            END IF;
            
            SET @sql_appointment = CONCAT(@sql_appointment,
                '(', v_patient_id, ',', v_doctor_id, ',', v_schedule_id, ',',
                QUOTE(v_appointment_time), ',', QUOTE(v_appt_status), ',',
                QUOTE(v_symptoms), ',NOW(),NOW())'
            );
            
            -- 更新排班
            IF v_appt_status != 'CANCELLED' THEN
                UPDATE schedules
                SET available_slots = GREATEST(0, available_slots - 1), updated_at = NOW()
                WHERE id = v_schedule_id;
            END IF;
            
            IF v_batch >= @BATCH_SIZE THEN
                SET @sql_appointment = CONCAT(@sql_appointment, ';');
                PREPARE stmt FROM @sql_appointment;
                EXECUTE stmt;
                DEALLOCATE PREPARE stmt;
                SET v_batch = 0;
                SET @sql_appointment = '';
            END IF;
            
            SET v_schedule_id = NULL;
        END WHILE;
    END LOOP;
    
    CLOSE cur_patient_ids;
    
    -- 执行剩余
    IF @sql_appointment != '' THEN
        SET @sql_appointment = CONCAT(@sql_appointment, ';');
        PREPARE stmt FROM @sql_appointment;
        EXECUTE stmt;
        DEALLOCATE PREPARE stmt;
    END IF;
    
    SET v_appointment_count = (SELECT COUNT(*) FROM appointments);
    SELECT CONCAT('--- 预约数据插入完成: ', v_appointment_count, '个') AS '';
    
    -- ==============================
    -- 执行统计
    -- ==============================
    SET v_end_time_log = NOW();
    SET v_elapsed = TIMESTAMPDIFF(SECOND, v_start_time_log, v_end_time_log);
    
    SELECT '========================================' AS '';
    SELECT '数据填充执行完成' AS '';
    SELECT CONCAT('科室数: ', (SELECT COUNT(*) FROM departments)) AS '';
    SELECT CONCAT('医生数: ', (SELECT COUNT(*) FROM doctors)) AS '';
    SELECT CONCAT('患者数: ', (SELECT COUNT(*) FROM users WHERE role = 'PATIENT')) AS '';
    SELECT CONCAT('排班数: ', (SELECT COUNT(*) FROM schedules)) AS '';
    SELECT CONCAT('预约数: ', (SELECT COUNT(*) FROM appointments)) AS '';
    SELECT CONCAT('执行耗时: ', v_elapsed, ' 秒') AS '';
    SELECT '========================================' AS '';
    
    -- 验证
    SELECT '验证: 医生和管理员用户预约数' AS '';
    SELECT u.username, u.name, u.role, COUNT(a.id) as appointment_count
    FROM users u
    LEFT JOIN appointments a ON u.id = a.patient_id
    WHERE u.role IN ('ADMIN', 'DOCTOR')
    GROUP BY u.id, u.username, u.name, u.role
    HAVING appointment_count > 0;
    
    -- 重置
    SET done = 0;
END //

DELIMITER ;

-- ====================================================================
-- 执行存储过程
-- ====================================================================
SELECT '>>> 开始执行批量数据填充...' AS '';
CALL batch_fill_data();

-- ====================================================================
-- 清理存储过程
-- ====================================================================
DROP PROCEDURE IF EXISTS batch_fill_data;

-- ====================================================================
-- 最终统计
-- ====================================================================
SELECT '>>> 数据填充完成!' AS '';
SELECT '--- 数据统计 ---' AS '';
SELECT '科室' AS table_name, COUNT(*) AS record_count FROM departments
UNION ALL
SELECT '医生', COUNT(*) FROM doctors
UNION ALL
SELECT '患者', COUNT(*) FROM users WHERE role = 'PATIENT'
UNION ALL
SELECT '排班', COUNT(*) FROM schedules
UNION ALL
SELECT '预约', COUNT(*) FROM appointments;
