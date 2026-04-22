package com.ruoyi.hospital.service.impl;

import com.ruoyi.hospital.domain.RegistrationSchedule;
import com.ruoyi.hospital.mapper.RegistrationScheduleMapper;
import com.ruoyi.hospital.service.IRegistrationScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 挂号时间表Service实现类
 */
@Service
public class RegistrationScheduleServiceImpl implements IRegistrationScheduleService {
    @Autowired
    private RegistrationScheduleMapper registrationScheduleMapper;

    /**
     * 查询挂号时间表
     *
     * @param scheduleId 挂号时间表ID
     * @return 挂号时间表
     */
    @Override
    public RegistrationSchedule selectRegistrationScheduleById(Long scheduleId) {
        return registrationScheduleMapper.selectRegistrationScheduleById(scheduleId);
    }

    /**
     * 查询挂号时间表列表
     *
     * @param registrationSchedule 挂号时间表
     * @return 挂号时间表集合
     */
    @Override
    public List<RegistrationSchedule> selectRegistrationScheduleList(RegistrationSchedule registrationSchedule) {
        return registrationScheduleMapper.selectRegistrationScheduleList(registrationSchedule);
    }

    /**
     * 按医生查询挂号时间表
     *
     * @param doctorId 医生ID
     * @return 挂号时间表集合
     */
    @Override
    public List<RegistrationSchedule> selectRegistrationScheduleByDoctorId(Long doctorId) {
        return registrationScheduleMapper.selectRegistrationScheduleByDoctorId(doctorId);
    }

    /**
     * 按医生和日期查询挂号时间表
     *
     * @param doctorId 医生ID
     * @param scheduleDate 排班日期
     * @return 挂号时间表
     */
    @Override
    public RegistrationSchedule selectRegistrationScheduleByDoctorAndDate(Long doctorId, Date scheduleDate) {
        return registrationScheduleMapper.selectRegistrationScheduleByDoctorAndDate(doctorId, scheduleDate);
    }

    /**
     * 新增挂号时间表
     *
     * @param registrationSchedule 挂号时间表
     * @return 结果
     */
    @Override
    public int insertRegistrationSchedule(RegistrationSchedule registrationSchedule) {
        return registrationScheduleMapper.insertRegistrationSchedule(registrationSchedule);
    }

    /**
     * 修改挂号时间表
     *
     * @param registrationSchedule 挂号时间表
     * @return 结果
     */
    @Override
    public int updateRegistrationSchedule(RegistrationSchedule registrationSchedule) {
        return registrationScheduleMapper.updateRegistrationSchedule(registrationSchedule);
    }

    /**
     * 减少上午可挂号数
     *
     * @param scheduleId 排班ID
     * @return 结果
     */
    @Override
    public int decreaseMorningAvailable(Long scheduleId) {
        return registrationScheduleMapper.decreaseMorningAvailable(scheduleId);
    }

    /**
     * 减少下午可挂号数
     *
     * @param scheduleId 排班ID
     * @return 结果
     */
    @Override
    public int decreaseAfternoonAvailable(Long scheduleId) {
        return registrationScheduleMapper.decreaseAfternoonAvailable(scheduleId);
    }

    /**
     * 删除挂号时间表
     *
     * @param scheduleId 挂号时间表ID
     * @return 结果
     */
    @Override
    public int deleteRegistrationScheduleById(Long scheduleId) {
        return registrationScheduleMapper.deleteRegistrationScheduleById(scheduleId);
    }

    /**
     * 批量删除挂号时间表
     *
     * @param scheduleIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deleteRegistrationScheduleByIds(Long[] scheduleIds) {
        return registrationScheduleMapper.deleteRegistrationScheduleByIds(scheduleIds);
    }
}