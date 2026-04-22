package com.ruoyi.hospital.service.impl;

import com.ruoyi.hospital.domain.AppointmentRecord;
import com.ruoyi.hospital.mapper.AppointmentRecordMapper;
import com.ruoyi.hospital.service.IAppointmentRecordService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * 预约记录表Service实现类
 */
@Service
public class AppointmentRecordServiceImpl implements IAppointmentRecordService {
    @Autowired
    private AppointmentRecordMapper appointmentRecordMapper;

    /**
     * 查询预约记录表
     *
     * @param appointmentId 预约记录表ID
     * @return 预约记录表
     */
    @Override
    public AppointmentRecord selectAppointmentRecordById(Long appointmentId) {
        return appointmentRecordMapper.selectAppointmentRecordById(appointmentId);
    }

    /**
     * 查询预约记录表列表
     *
     * @param appointmentRecord 预约记录表
     * @return 预约记录表集合
     */
    @Override
    public List<AppointmentRecord> selectAppointmentRecordList(AppointmentRecord appointmentRecord) {
        return appointmentRecordMapper.selectAppointmentRecordList(appointmentRecord);
    }

    /**
     * 按患者查询预约记录表
     *
     * @param patientId 患者ID
     * @return 预约记录表集合
     */
    @Override
    public List<AppointmentRecord> selectAppointmentRecordByPatientId(Long patientId) {
        return appointmentRecordMapper.selectAppointmentRecordByPatientId(patientId);
    }

    /**
     * 按医生查询预约记录表
     *
     * @param doctorId 医生ID
     * @return 预约记录表集合
     */
    @Override
    public List<AppointmentRecord> selectAppointmentRecordByDoctorId(Long doctorId) {
        return appointmentRecordMapper.selectAppointmentRecordByDoctorId(doctorId);
    }

    /**
     * 新增预约记录表
     *
     * @param appointmentRecord 预约记录表
     * @return 结果
     */
    @Override
    public int insertAppointmentRecord(AppointmentRecord appointmentRecord) {
        // 生成挂号编号
        String registrationNo = "REG" + new Date().getTime();
        appointmentRecord.setRegistrationNo(registrationNo);
        // 设置默认状态
        appointmentRecord.setStatus("0"); // 0待就诊
        return appointmentRecordMapper.insertAppointmentRecord(appointmentRecord);
    }

    /**
     * 修改预约记录表
     *
     * @param appointmentRecord 预约记录表
     * @return 结果
     */
    @Override
    public int updateAppointmentRecord(AppointmentRecord appointmentRecord) {
        return appointmentRecordMapper.updateAppointmentRecord(appointmentRecord);
    }

    /**
     * 取消预约
     *
     * @param appointmentId 预约ID
     * @return 结果
     */
    @Override
    public int cancelAppointment(Long appointmentId) {
        AppointmentRecord appointmentRecord = new AppointmentRecord();
        appointmentRecord.setAppointmentId(appointmentId);
        appointmentRecord.setStatus("2"); // 2已取消
        appointmentRecord.setUpdateTime(new Date());
        return appointmentRecordMapper.updateAppointmentRecord(appointmentRecord);
    }

    /**
     * 删除预约记录表
     *
     * @param appointmentId 预约记录表ID
     * @return 结果
     */
    @Override
    public int deleteAppointmentRecordById(Long appointmentId) {
        return appointmentRecordMapper.deleteAppointmentRecordById(appointmentId);
    }

    /**
     * 批量删除预约记录表
     *
     * @param appointmentIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deleteAppointmentRecordByIds(Long[] appointmentIds) {
        return appointmentRecordMapper.deleteAppointmentRecordByIds(appointmentIds);
    }
}