package com.ruoyi.hospital.mapper;

import com.ruoyi.hospital.domain.PatientInfo;

import java.util.List;

/**
 * 患者信息Mapper接口
 */
public interface PatientInfoMapper {
    /**
     * 查询患者信息
     *
     * @param patientId 患者信息ID
     * @return 患者信息
     */
    public PatientInfo selectPatientInfoById(Long patientId);

    /**
     * 根据身份证号查询患者信息
     *
     * @param idCard 身份证号
     * @return 患者信息
     */
    public PatientInfo selectPatientInfoByIdCard(String idCard);

    /**
     * 查询患者信息列表
     *
     * @param patientInfo 患者信息
     * @return 患者信息集合
     */
    public List<PatientInfo> selectPatientInfoList(PatientInfo patientInfo);

    /**
     * 新增患者信息
     *
     * @param patientInfo 患者信息
     * @return 结果
     */
    public int insertPatientInfo(PatientInfo patientInfo);

    /**
     * 修改患者信息
     *
     * @param patientInfo 患者信息
     * @return 结果
     */
    public int updatePatientInfo(PatientInfo patientInfo);

    /**
     * 删除患者信息
     *
     * @param patientId 患者信息ID
     * @return 结果
     */
    public int deletePatientInfoById(Long patientId);

    /**
     * 批量删除患者信息
     *
     * @param patientIds 需要删除的数据ID
     * @return 结果
     */
    public int deletePatientInfoByIds(Long[] patientIds);
}