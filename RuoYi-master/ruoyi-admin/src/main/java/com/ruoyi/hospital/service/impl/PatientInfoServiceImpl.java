package com.ruoyi.hospital.service.impl;

import com.ruoyi.common.core.text.Convert;
import com.ruoyi.hospital.domain.PatientInfo;
import com.ruoyi.hospital.mapper.PatientInfoMapper;
import com.ruoyi.hospital.service.IPatientInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 患者信息Service实现类
 */
@Service
public class PatientInfoServiceImpl implements IPatientInfoService {
    @Autowired
    private PatientInfoMapper patientInfoMapper;

    /**
     * 查询患者信息
     *
     * @param patientId 患者信息ID
     * @return 患者信息
     */
    @Override
    public PatientInfo selectPatientInfoById(Long patientId) {
        return patientInfoMapper.selectPatientInfoById(patientId);
    }

    /**
     * 根据身份证号查询患者信息
     *
     * @param idCard 身份证号
     * @return 患者信息
     */
    @Override
    public PatientInfo selectPatientInfoByIdCard(String idCard) {
        return patientInfoMapper.selectPatientInfoByIdCard(idCard);
    }

    /**
     * 查询患者信息列表
     *
     * @param patientInfo 患者信息
     * @return 患者信息集合
     */
    @Override
    public List<PatientInfo> selectPatientInfoList(PatientInfo patientInfo) {
        return patientInfoMapper.selectPatientInfoList(patientInfo);
    }

    /**
     * 新增患者信息
     *
     * @param patientInfo 患者信息
     * @return 结果
     */
    @Override
    public int insertPatientInfo(PatientInfo patientInfo) {
        return patientInfoMapper.insertPatientInfo(patientInfo);
    }

    /**
     * 修改患者信息
     *
     * @param patientInfo 患者信息
     * @return 结果
     */
    @Override
    public int updatePatientInfo(PatientInfo patientInfo) {
        return patientInfoMapper.updatePatientInfo(patientInfo);
    }

    /**
     * 删除患者信息
     *
     * @param patientId 患者信息ID
     * @return 结果
     */
    @Override
    public int deletePatientInfoById(Long patientId) {
        return patientInfoMapper.deletePatientInfoById(patientId);
    }

    /**
     * 批量删除患者信息
     *
     * @param patientIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deletePatientInfoByIds(Long[] patientIds) {
        return patientInfoMapper.deletePatientInfoByIds(patientIds);
    }
}