package com.ruoyi.hospital.domain;

import com.ruoyi.common.core.domain.BaseEntity;

import java.util.Date;

/**
 * 预约记录表
 */
public class AppointmentRecord extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 预约ID */
    private Long appointmentId;

    /** 患者ID */
    private Long patientId;

    /** 患者姓名 */
    private String patientName;

    /** 医生ID */
    private Long doctorId;

    /** 医生姓名 */
    private String doctorName;

    /** 科室ID */
    private Long deptId;

    /** 科室名称 */
    private String deptName;

    /** 排班ID */
    private Long scheduleId;

    /** 预约日期 */
    private Date appointmentDate;

    /** 预约时段（0上午 1下午） */
    private String appointmentTime;

    /** 挂号编号 */
    private String registrationNo;

    /** 状态（0待就诊 1已就诊 2已取消） */
    private String status;

    public Long getAppointmentId() {
        return appointmentId;
    }

    public void setAppointmentId(Long appointmentId) {
        this.appointmentId = appointmentId;
    }

    public Long getPatientId() {
        return patientId;
    }

    public void setPatientId(Long patientId) {
        this.patientId = patientId;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public Long getDoctorId() {
        return doctorId;
    }

    public void setDoctorId(Long doctorId) {
        this.doctorId = doctorId;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public Long getDeptId() {
        return deptId;
    }

    public void setDeptId(Long deptId) {
        this.deptId = deptId;
    }

    public String getDeptName() {
        return deptName;
    }

    public void setDeptName(String deptName) {
        this.deptName = deptName;
    }

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getRegistrationNo() {
        return registrationNo;
    }

    public void setRegistrationNo(String registrationNo) {
        this.registrationNo = registrationNo;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}