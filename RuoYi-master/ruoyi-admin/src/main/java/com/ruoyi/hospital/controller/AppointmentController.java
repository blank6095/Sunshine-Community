package com.ruoyi.hospital.controller;

import com.ruoyi.common.core.controller.BaseController;
import com.ruoyi.common.core.domain.AjaxResult;
import com.ruoyi.common.core.page.TableDataInfo;
import com.ruoyi.hospital.domain.AppointmentRecord;
import com.ruoyi.hospital.domain.RegistrationSchedule;
import com.ruoyi.hospital.service.IAppointmentRecordService;
import com.ruoyi.hospital.service.IRegistrationScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

/**
 * 预约管理控制器
 */
@Controller
@RequestMapping("/hospital/appointment")
public class AppointmentController extends BaseController {
    @Autowired
    private IRegistrationScheduleService registrationScheduleService;

    @Autowired
    private IAppointmentRecordService appointmentRecordService;

    /**
     * 预约管理页面
     */
    @GetMapping("/list")
    public String appointmentList() {
        return "hospital/appointment/list";
    }

    /**
     * 预约管理列表数据
     */
    @PostMapping("/list")
    @ResponseBody
    public TableDataInfo appointmentListData(AppointmentRecord appointmentRecord) {
        startPage();
        List<AppointmentRecord> list = appointmentRecordService.selectAppointmentRecordList(appointmentRecord);
        return getDataTable(list);
    }

    /**
     * 按患者查询预约记录
     */
    @GetMapping("/listByPatient/{patientId}")
    @ResponseBody
    public AjaxResult appointmentListByPatient(@PathVariable Long patientId) {
        List<AppointmentRecord> list = appointmentRecordService.selectAppointmentRecordByPatientId(patientId);
        return success().put("data", list);
    }

    /**
     * 创建预约页面
     */
    @GetMapping("/create")
    public String createAppointment(Long doctorId, ModelMap mmap) {
        mmap.put("doctorId", doctorId);
        return "hospital/appointment/create";
    }

    /**
     * 获取医生的号源列表
     */
    @GetMapping("/schedule/listByDoctor/{doctorId}")
    @ResponseBody
    public AjaxResult scheduleListByDoctor(@PathVariable Long doctorId) {
        List<RegistrationSchedule> list = registrationScheduleService.selectRegistrationScheduleByDoctorId(doctorId);
        return success().put("data", list);
    }

    /**
     * 创建预约
     */
    @PostMapping("/create")
    @ResponseBody
    public AjaxResult createAppointment(@RequestBody AppointmentRecord appointment) {
        // 检查号源是否可用
        RegistrationSchedule schedule = registrationScheduleService.selectRegistrationScheduleById(appointment.getScheduleId());
        if (schedule == null) {
            return error("号源不存在");
        }

        // 检查时间段是否有号
        if ("0".equals(appointment.getAppointmentTime())) {
            if (schedule.getMorningAvailable() <= 0) {
                return error("上午号源已用完");
            }
            // 减少上午可挂号数
            registrationScheduleService.decreaseMorningAvailable(appointment.getScheduleId());
        } else {
            if (schedule.getAfternoonAvailable() <= 0) {
                return error("下午号源已用完");
            }
            // 减少下午可挂号数
            registrationScheduleService.decreaseAfternoonAvailable(appointment.getScheduleId());
        }

        // 创建预约记录
        int result = appointmentRecordService.insertAppointmentRecord(appointment);
        if (result > 0) {
            return success("预约成功");
        }
        return error("预约失败");
    }

    /**
     * 取消预约
     */
    @PostMapping("/cancel/{appointmentId}")
    @ResponseBody
    public AjaxResult cancelAppointment(@PathVariable Long appointmentId) {
        int result = appointmentRecordService.cancelAppointment(appointmentId);
        if (result > 0) {
            return success("取消预约成功");
        }
        return error("取消预约失败");
    }

    /**
     * 预约详情
     */
    @GetMapping("/detail/{appointmentId}")
    public String appointmentDetail(@PathVariable Long appointmentId, ModelMap mmap) {
        AppointmentRecord appointment = appointmentRecordService.selectAppointmentRecordById(appointmentId);
        mmap.put("appointment", appointment);
        return "hospital/appointment/detail";
    }
}