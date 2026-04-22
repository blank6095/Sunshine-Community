package com.ruoyi.hospital.controller;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.hospital.domain.DepartmentInfo;
import com.ruoyi.hospital.service.IDepartmentInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 科室管理控制器
 */
@Controller
@RequestMapping("/hospital/admin/department")
public class DepartmentController extends BaseController {
    @Autowired
    private IDepartmentInfoService departmentInfoService;

    /**
     * 科室管理页面
     */
    @GetMapping("/list")
    public String departmentList() {
        return "hospital/admin/department/list";
    }

    /**
     * 科室管理列表数据
     */
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo departmentListData(DepartmentInfo departmentInfo) {
        startPage();
        List<DepartmentInfo> list = departmentInfoService.selectDepartmentInfoList(departmentInfo);
        return getDataTable(list);
    }

    /**
     * 添加科室页面
     */
    @GetMapping("/add")
    public String addDepartment() {
        return "hospital/admin/department/add";
    }

    /**
     * 添加科室
     */
    @PostMapping("/add")
    @ResponseBody
    public AjaxResult addDepartment(@RequestBody DepartmentInfo departmentInfo) {
        int result = departmentInfoService.insertDepartmentInfo(departmentInfo);
        if (result > 0) {
            return success("添加成功");
        }
        return error("添加失败");
    }

    /**
     * 修改科室页面
     */
    @GetMapping("/edit/{deptId}")
    public String editDepartment(@PathVariable Long deptId, ModelMap mmap) {
        DepartmentInfo department = departmentInfoService.selectDepartmentInfoById(deptId);
        mmap.put("department", department);
        return "hospital/admin/department/edit";
    }

    /**
     * 修改科室
     */
    @PostMapping("/edit")
    @ResponseBody
    public AjaxResult editDepartment(@RequestBody DepartmentInfo departmentInfo) {
        int result = departmentInfoService.updateDepartmentInfo(departmentInfo);
        if (result > 0) {
            return success("修改成功");
        }
        return error("修改失败");
    }

    /**
     * 删除科室
     */
    @PostMapping("/delete/{deptId}")
    @ResponseBody
    public AjaxResult deleteDepartment(@PathVariable Long deptId) {
        int result = departmentInfoService.deleteDepartmentInfoById(deptId);
        if (result > 0) {
            return success("删除成功");
        }
        return error("删除失败");
    }

    /**
     * 批量删除科室
     */
    @PostMapping("/delete")
    @ResponseBody
    public AjaxResult deleteDepartments(Long[] deptIds) {
        int result = departmentInfoService.deleteDepartmentInfoByIds(deptIds);
        if (result > 0) {
            return success("删除成功");
        }
        return error("删除失败");
    }
}