package com.ruoyi.hospital.domain;

import com.ruoyi.common.core.domain.BaseEntity;

import java.util.Date;

/**
 * 挂号时间表
 */
public class RegistrationSchedule extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 排班ID */
    private Long scheduleId;

    /** 医生ID */
    private Long doctorId;

    /** 医生姓名 */
    private String doctorName;

    /** 科室ID */
    private Long deptId;

    /** 科室名称 */
    private String deptName;

    /** 排班日期 */
    private Date scheduleDate;

    /** 上午可挂号数 */
    private Integer morningAvailable;

    /** 下午可挂号数 */
    private Integer afternoonAvailable;

    /** 上午总号数 */
    private Integer morningTotal;

    /** 下午总号数 */
    private Integer afternoonTotal;

    /** 状态（0正常 1停用） */
    private String status;

    public Long getScheduleId() {
        return scheduleId;
    }

    public void setScheduleId(Long scheduleId) {
        this.scheduleId = scheduleId;
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

    public Date getScheduleDate() {
        return scheduleDate;
    }

    public void setScheduleDate(Date scheduleDate) {
        this.scheduleDate = scheduleDate;
    }

    public Integer getMorningAvailable() {
        return morningAvailable;
    }

    public void setMorningAvailable(Integer morningAvailable) {
        this.morningAvailable = morningAvailable;
    }

    public Integer getAfternoonAvailable() {
        return afternoonAvailable;
    }

    public void setAfternoonAvailable(Integer afternoonAvailable) {
        this.afternoonAvailable = afternoonAvailable;
    }

    public Integer getMorningTotal() {
        return morningTotal;
    }

    public void setMorningTotal(Integer morningTotal) {
        this.morningTotal = morningTotal;
    }

    public Integer getAfternoonTotal() {
        return afternoonTotal;
    }

    public void setAfternoonTotal(Integer afternoonTotal) {
        this.afternoonTotal = afternoonTotal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}