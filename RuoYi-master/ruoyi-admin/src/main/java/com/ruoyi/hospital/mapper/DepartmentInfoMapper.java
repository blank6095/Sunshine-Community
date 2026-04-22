package com.ruoyi.hospital.mapper;

import com.ruoyi.hospital.domain.DepartmentInfo;

import java.util.List;

/**
 * 科室信息Mapper接口
 */
public interface DepartmentInfoMapper {
    /**
     * 查询科室信息
     *
     * @param deptId 科室信息ID
     * @return 科室信息
     */
    public DepartmentInfo selectDepartmentInfoById(Long deptId);

    /**
     * 查询科室信息列表
     *
     * @param departmentInfo 科室信息
     * @return 科室信息集合
     */
    public List<DepartmentInfo> selectDepartmentInfoList(DepartmentInfo departmentInfo);

    /**
     * 新增科室信息
     *
     * @param departmentInfo 科室信息
     * @return 结果
     */
    public int insertDepartmentInfo(DepartmentInfo departmentInfo);

    /**
     * 修改科室信息
     *
     * @param departmentInfo 科室信息
     * @return 结果
     */
    public int updateDepartmentInfo(DepartmentInfo departmentInfo);

    /**
     * 删除科室信息
     *
     * @param deptId 科室信息ID
     * @return 结果
     */
    public int deleteDepartmentInfoById(Long deptId);

    /**
     * 批量删除科室信息
     *
     * @param deptIds 需要删除的数据ID
     * @return 结果
     */
    public int deleteDepartmentInfoByIds(Long[] deptIds);
}