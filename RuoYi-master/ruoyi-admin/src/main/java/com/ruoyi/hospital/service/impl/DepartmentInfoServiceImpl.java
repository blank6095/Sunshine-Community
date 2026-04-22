package com.ruoyi.hospital.service.impl;

import com.ruoyi.hospital.domain.DepartmentInfo;
import com.ruoyi.hospital.mapper.DepartmentInfoMapper;
import com.ruoyi.hospital.service.IDepartmentInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 科室信息Service实现类
 */
@Service
public class DepartmentInfoServiceImpl implements IDepartmentInfoService {
    @Autowired
    private DepartmentInfoMapper departmentInfoMapper;

    /**
     * 查询科室信息
     *
     * @param deptId 科室信息ID
     * @return 科室信息
     */
    @Override
    public DepartmentInfo selectDepartmentInfoById(Long deptId) {
        return departmentInfoMapper.selectDepartmentInfoById(deptId);
    }

    /**
     * 查询科室信息列表
     *
     * @param departmentInfo 科室信息
     * @return 科室信息集合
     */
    @Override
    public List<DepartmentInfo> selectDepartmentInfoList(DepartmentInfo departmentInfo) {
        return departmentInfoMapper.selectDepartmentInfoList(departmentInfo);
    }

    /**
     * 新增科室信息
     *
     * @param departmentInfo 科室信息
     * @return 结果
     */
    @Override
    public int insertDepartmentInfo(DepartmentInfo departmentInfo) {
        return departmentInfoMapper.insertDepartmentInfo(departmentInfo);
    }

    /**
     * 修改科室信息
     *
     * @param departmentInfo 科室信息
     * @return 结果
     */
    @Override
    public int updateDepartmentInfo(DepartmentInfo departmentInfo) {
        return departmentInfoMapper.updateDepartmentInfo(departmentInfo);
    }

    /**
     * 删除科室信息
     *
     * @param deptId 科室信息ID
     * @return 结果
     */
    @Override
    public int deleteDepartmentInfoById(Long deptId) {
        return departmentInfoMapper.deleteDepartmentInfoById(deptId);
    }

    /**
     * 批量删除科室信息
     *
     * @param deptIds 需要删除的数据ID
     * @return 结果
     */
    @Override
    public int deleteDepartmentInfoByIds(Long[] deptIds) {
        return departmentInfoMapper.deleteDepartmentInfoByIds(deptIds);
    }
}