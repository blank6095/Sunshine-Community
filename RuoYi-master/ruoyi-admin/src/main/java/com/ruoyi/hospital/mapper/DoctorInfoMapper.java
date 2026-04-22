package com.ruoyi.hospital.mapper;

import com.ruoyi.hospital.domain.DoctorInfo;

import java.util.List;

/**
 * 医生信息Mapper接口
 */
public interface DoctorInfoMapper {
    /**
     * 查询医生信息
     *
     * @param doctorId 医生信息ID
     * @return 医生信息
     */
    public DoctorInfo selectDoctorInfoById(Long doctorId);

    /**
     * 查询医生信息列表
     *
     * @param doctorInfo 医生信息
     * @return 医生信息集合
     */
    public List<DoctorInfo> selectDoctorInfoList(DoctorInfo doctorInfo);

    /**
     * 按科室查询医生信息
     *
     * @param deptId 科室ID
     * @return 医生信息集合
     */
    public List<DoctorInfo> selectDoctorInfoByDeptId(Long deptId);

    /**
     * 新增医生信息
     *
     * @param doctorInfo 医生信息
     * @return 结果
     */
    public int insertDoctorInfo(DoctorInfo doctorInfo);

    /**
     * 修改医生信息
     *
     * @param doctorInfo 医生信息
     * @return 结果
     */
    public int updateDoctorInfo(DoctorInfo doctorInfo);

    /**
     * 删除医生信息
     *
     * @param doctorId 医生信息ID
     * @return 结果
     */
    public int deleteDoctorInfoById(Long doctorId);

    /**
     * 批量删除医生信息
     *
     * @param doctorIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteDoctorInfoByIds(Long[] doctorIds);
}