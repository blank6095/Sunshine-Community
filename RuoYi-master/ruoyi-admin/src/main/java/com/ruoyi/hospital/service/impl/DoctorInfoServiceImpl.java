package com.ruoyi.hospital.service.impl;

import com.ruoyi.hospital.domain.DoctorInfo;
import com.ruoyi.hospital.mapper.DoctorInfoMapper;
import com.ruoyi.hospital.service.IDoctorInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 医生信息Service实现类
 */
@Service
public class DoctorInfoServiceImpl implements IDoctorInfoService {
    @Autowired
    private DoctorInfoMapper doctorInfoMapper;

    /**
     * 查询医生信息
     *
     * @param doctorId 医生信息ID
     * @return 医生信息
     */
    @Override
    public DoctorInfo selectDoctorInfoById(Long doctorId) {
        return doctorInfoMapper.selectDoctorInfoById(doctorId);
    }

    /**
     * 查询医生信息列表
     *
     * @param doctorInfo 医生信息
     * @return 医生信息集合
     */
    @Override
    public List<DoctorInfo> selectDoctorInfoList(DoctorInfo doctorInfo) {
        return doctorInfoMapper.selectDoctorInfoList(doctorInfo);
    }

    /**
     * 按科室查询医生信息
     *
     * @param deptId 科室ID
     * @return 医生信息集合
     */
    @Override
    public List<DoctorInfo> selectDoctorInfoByDeptId(Long deptId) {
        return doctorInfoMapper.selectDoctorInfoByDeptId(deptId);
    }

    /**
     * 新增医生信息
     *
     * @param doctorInfo 医生信息
     * @return 结果
     */
    @Override
    public int insertDoctorInfo(DoctorInfo doctorInfo) {
        return doctorInfoMapper.insertDoctorInfo(doctorInfo);
    }

    /**
     * 修改医生信息
     *
     * @param doctorInfo 医生信息
     * @return 结果
     */
    @Override
    public int updateDoctorInfo(DoctorInfo doctorInfo) {
        return doctorInfoMapper.updateDoctorInfo(doctorInfo);
    }

    /**
     * 删除医生信息
     *
     * @param doctorId 医生信息ID
     * @return 结果
     */
    @Override
    public int deleteDoctorInfoById(Long doctorId) {
        return doctorInfoMapper.deleteDoctorInfoById(doctorId);
    }

    /**
     * 批量删除医生信息
     *
     * @param doctorIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deleteDoctorInfoByIds(Long[] doctorIds) {
        return doctorInfoMapper.deleteDoctorInfoByIds(doctorIds);
    }
}