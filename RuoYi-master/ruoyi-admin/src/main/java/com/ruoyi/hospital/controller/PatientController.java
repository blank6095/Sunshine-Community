package com.ruoyi.hospital.controller;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.utils.StringUtils;
import com.ruoyi.hospital.domain.PatientInfo;
import com.ruoyi.hospital.service.IPatientInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 患者控制器
 */
@Controller
public class PatientController extends BaseController {
    @Autowired
    private IPatientInfoService patientInfoService;

    /**
     * 患者注册页面
     */
    @GetMapping("/patient/register")
    public String register() {
        return "hospital/patient/register";
    }

    /**
     * 患者登录页面
     */
    @GetMapping("/patient/login")
    public String login() {
        return "hospital/patient/login";
    }

    /**
     * 患者注册
     */
    @PostMapping("/patient/register")
    @ResponseBody
    public AjaxResult ajaxRegister(@RequestBody PatientInfo patient) {
        // 检查身份证号是否已存在
        PatientInfo existingPatient = patientInfoService.selectPatientInfoByIdCard(patient.getIdCard());
        if (existingPatient != null) {
            return error("身份证号已注册");
        }

        // 设置默认状态
        patient.setStatus("0");
        // 新增患者信息
        int result = patientInfoService.insertPatientInfo(patient);
        if (result > 0) {
            return success("注册成功");
        }
        return error("注册失败");
    }

    /**
     * 患者登录
     */
    @PostMapping("/patient/login")
    @ResponseBody
    public AjaxResult ajaxLogin(String idCard, String phone) {
        // 根据身份证号查询患者信息
        PatientInfo patient = patientInfoService.selectPatientInfoByIdCard(idCard);
        if (patient == null) {
            return error("患者不存在");
        }

        // 验证手机号
        if (!StringUtils.equals(patient.getPhone(), phone)) {
            return error("手机号错误");
        }

        // 登录成功，返回患者信息
        return success().put("patient", patient);
    }

    /**
     * 获取患者个人信息
     */
    @GetMapping("/patient/info")
    @ResponseBody
    public AjaxResult getPatientInfo(Long patientId) {
        PatientInfo patient = patientInfoService.selectPatientInfoById(patientId);
        if (patient == null) {
            return error("患者不存在");
        }
        return success().put("patient", patient);
    }

    /**
     * 更新患者个人信息
     */
    @PostMapping("/patient/info")
    @ResponseBody
    public AjaxResult updatePatientInfo(@RequestBody PatientInfo patient) {
        int result = patientInfoService.updatePatientInfo(patient);
        if (result > 0) {
            return success("更新成功");
        }
        return error("更新失败");
    }
}