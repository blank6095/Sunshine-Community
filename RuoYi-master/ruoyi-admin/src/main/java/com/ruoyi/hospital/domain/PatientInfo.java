package com.ruoyi.hospital.domain;

import com.ruoyi.common.core.domain.BaseEntity;

import java.util.Date;

/**
 * 患者信息表
 */
public class PatientInfo extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 患者ID */
    private Long patientId;

    /** 患者姓名 */
    private String patientName;

    /** 身份证号 */
    private String idCard;

    /** 联系电话 */
    private String phone;

    /** 性别（0男 1女） */
    private String gender;

    /** 出生日期 */
    private Date birthDate;

    /** 地址 */
    private String address;

    /** 状态（0正常 1停用） */
    private String status;

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

    public String getIdCard() {
        return idCard;
    }

    public void setIdCard(String idCard) {
        this.idCard = idCard;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Date getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(Date birthDate) {
        this.birthDate = birthDate;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}