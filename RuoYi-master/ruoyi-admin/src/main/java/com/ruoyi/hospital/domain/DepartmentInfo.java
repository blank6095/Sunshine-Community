package com.ruoyi.hospital.domain;

import com.ruoyi.common.core.domain.BaseEntity;

/**
 * 科室信息表
 */
public class DepartmentInfo extends BaseEntity {
    private static final long serialVersionUID = 1L;

    /** 科室ID */
    private Long deptId;

    /** 科室名称 */
    private String deptName;

    /** 科室编码 */
    private String deptCode;

    /** 科室描述 */
    private String deptDesc;

    /** 状态（0正常 1停用） */
    private String status;

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

    public String getDeptCode() {
        return deptCode;
    }

    public void setDeptCode(String deptCode) {
        this.deptCode = deptCode;
    }

    public String getDeptDesc() {
        return deptDesc;
    }

    public void setDeptDesc(String deptDesc) {
        this.deptDesc = deptDesc;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}