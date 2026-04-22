package com.ruoyi.hospital.controller;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.hospital.domain.DepartmentInfo;
import com.ruoyi.hospital.domain.DoctorInfo;
import com.ruoyi.hospital.service.IDepartmentInfoService;
import com.ruoyi.hospital.service.IDoctorInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 医院控制器
 */
@Controller
@RequestMapping("/hospital")
public class HospitalController extends BaseController {
    @Autowired
    private IDepartmentInfoService departmentInfoService;

    @Autowired
    private IDoctorInfoService doctorInfoService;

    /**
     * 医院首页
     */
    @GetMapping("/index")
    public String index() {
        return "hospital/index";
    }

    /**
     * 科室列表
     */
    @GetMapping("/department/list")
    @ResponseBody
    public AjaxResult departmentList() {
        DepartmentInfo departmentInfo = new DepartmentInfo();
        departmentInfo.setStatus("0"); // 只查询正常状态的科室
        List<DepartmentInfo> list = departmentInfoService.selectDepartmentInfoList(departmentInfo);
        return success().put("data", list);
    }

    /**
     * 医生列表
     */
    @GetMapping("/doctor/list")
    public String doctorList(Long deptId, ModelMap mmap) {
        mmap.put("deptId", deptId);
        return "hospital/doctor/list";
    }

    /**
     * 医生列表数据
     */
    @PostMapping("/doctor/list")
    @ResponseBody
    public TableDataInfo doctorListData(DoctorInfo doctorInfo) {
        startPage();
        List<DoctorInfo> list = doctorInfoService.selectDoctorInfoList(doctorInfo);
        return getDataTable(list);
    }

    /**
     * 按科室查询医生列表
     */
    @GetMapping("/doctor/listByDept/{deptId}")
    @ResponseBody
    public AjaxResult doctorListByDept(@PathVariable Long deptId) {
        List<DoctorInfo> list = doctorInfoService.selectDoctorInfoByDeptId(deptId);
        return success().put("data", list);
    }

    /**
     * 医生详情
     */
    @GetMapping("/doctor/detail/{doctorId}")
    public String doctorDetail(@PathVariable Long doctorId, ModelMap mmap) {
        DoctorInfo doctor = doctorInfoService.selectDoctorInfoById(doctorId);
        mmap.put("doctor", doctor);
        return "hospital/doctor/detail";
    }

    /**
     * 患者个人中心
     */
    @GetMapping("/patient/profile")
    public String patientProfile() {
        return "hospital/patient/profile";
    }
}