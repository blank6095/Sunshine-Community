package com.ruoyi.hospital.service;

import com.ruoyi.hospital.domain.AppointmentRecord;

import java.util.List;

/**
 * 预约记录表Service接口
 */
public interface IAppointmentRecordService {
    /**
     * 查询预约记录表
     *
     * @param appointmentId 预约记录表ID
     * @return 预约记录表
     */
    public AppointmentRecord selectAppointmentRecordById(Long appointmentId);

    /**
     * 查询预约记录表列表
     *
     * @param appointmentRecord 预约记录表
     * @return 预约记录表集合
     */
    public List<AppointmentRecord> selectAppointmentRecordList(AppointmentRecord appointmentRecord);

    /**
     * 按患者查询预约记录表
     *
     * @param patientId 患者ID
     * @return 预约记录表集合
     */
    public List<AppointmentRecord> selectAppointmentRecordByPatientId(Long patientId);

    /**
     * 按医生查询预约记录表
     *
     * @param doctorId 医生ID
     * @return 预约记录表集合
     */
    public List<AppointmentRecord> selectAppointmentRecordByDoctorId(Long doctorId);

    /**
     * 新增预约记录表
     *
     * @param appointmentRecord 预约记录表
     * @return 结果
     */
    public int insertAppointmentRecord(AppointmentRecord appointmentRecord);

    /**
     * 修改预约记录表
     *
     * @param appointmentRecord 预约记录表
     * @return 结果
     */
    public int updateAppointmentRecord(AppointmentRecord appointmentRecord);

    /**
     * 取消预约
     *
     * @param appointmentId 预约ID
     * @return 结果
     */
    public int cancelAppointment(Long appointmentId);

    /**
     * 删除预约记录表
     *
     * @param appointmentId 预约记录表ID
     * @return 结果
     */
    public int deleteAppointmentRecordById(Long appointmentId);

    /**
     * 批量删除预约记录表
     *
     * @param appointmentIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteAppointmentRecordByIds(Long[] appointmentIds);
}