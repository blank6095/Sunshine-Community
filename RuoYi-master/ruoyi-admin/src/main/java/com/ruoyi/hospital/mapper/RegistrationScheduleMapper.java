package com.ruoyi.hospital.mapper;

import com.ruoyi.hospital.domain.RegistrationSchedule;

import java.util.Date;
import java.util.List;

/**
 * 挂号时间表Mapper接口
 */
public interface RegistrationScheduleMapper {
    /**
     * 查询挂号时间表
     *
     * @param scheduleId 挂号时间表ID
     * @return 挂号时间表
     */
    public RegistrationSchedule selectRegistrationScheduleById(Long scheduleId);

    /**
     * 查询挂号时间表列表
     *
     * @param registrationSchedule 挂号时间表
     * @return 挂号时间表集合
     */
    public List<RegistrationSchedule> selectRegistrationScheduleList(RegistrationSchedule registrationSchedule);

    /**
     * 按医生查询挂号时间表
     *
     * @param doctorId 医生ID
     * @return 挂号时间表集合
     */
    public List<RegistrationSchedule> selectRegistrationScheduleByDoctorId(Long doctorId);

    /**
     * 按医生和日期查询挂号时间表
     *
     * @param doctorId 医生ID
     * @param scheduleDate 排班日期
     * @return 挂号时间表
     */
    public RegistrationSchedule selectRegistrationScheduleByDoctorAndDate(Long doctorId, Date scheduleDate);

    /**
     * 新增挂号时间表
     *
     * @param registrationSchedule 挂号时间表
     * @return 结果
     */
    public int insertRegistrationSchedule(RegistrationSchedule registrationSchedule);

    /**
     * 修改挂号时间表
     *
     * @param registrationSchedule 挂号时间表
     * @return 结果
     */
    public int updateRegistrationSchedule(RegistrationSchedule registrationSchedule);

    /**
     * 减少上午可挂号数
     *
     * @param scheduleId 排班ID
     * @return 结果
     */
    public int decreaseMorningAvailable(Long scheduleId);

    /**
     * 减少下午可挂号数
     *
     * @param scheduleId 排班ID
     * @return 结果
     */
    public int decreaseAfternoonAvailable(Long scheduleId);

    /**
     * 删除挂号时间表
     *
     * @param scheduleId 挂号时间表ID
     * @return 结果
     */
    public int deleteRegistrationScheduleById(Long scheduleId);

    /**
     * 批量删除挂号时间表
     *
     * @param scheduleIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteRegistrationScheduleByIds(Long[] scheduleIds);
}