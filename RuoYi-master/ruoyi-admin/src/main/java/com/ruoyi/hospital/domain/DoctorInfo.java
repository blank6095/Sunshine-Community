package com.ruoyi.hospital.domain;

import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 医生信息表
 */
public class DoctorInfo extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 医生ID */
    private Long doctorId;

    /** 医生姓名 */
    private String doctorName;

    /** 医生编码 */
    private String doctorCode;

    /** 所属科室ID */
    private Long deptId;

    /** 科室名称 */
    private String deptName;

    /** 职称 */
    private String title;

    /** 专业特长 */
    private String specialty;

    /** 头像 */
    private String avatar;

    /** 联系电话 */
    private String phone;

    /** 状态（0正常 1停用） */
    private String status;

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

    public String getDoctorCode() {
        return doctorCode;
    }

    public void setDoctorCode(String doctorCode) {
        this.doctorCode = doctorCode;
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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getSpecialty() {
        return specialty;
    }

    public void setSpecialty(String specialty) {
        this.specialty = specialty;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}