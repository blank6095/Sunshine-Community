package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.dto.ScheduleResponse;
import com.exclusive.blank.model.Schedule;
import com.exclusive.blank.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/schedules")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedules() {
        List<ScheduleResponse> schedules = scheduleService.getSchedules();
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> getScheduleById(@PathVariable Long id) {
        ScheduleResponse schedule = scheduleService.getScheduleById(id);
        return ResponseEntity.ok(ApiResponse.success(schedule));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> createSchedule(@RequestBody Schedule schedule) {
        ScheduleResponse createdSchedule = scheduleService.createSchedule(schedule);
        return ResponseEntity.status(201).body(ApiResponse.created(createdSchedule));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        ScheduleResponse updatedSchedule = scheduleService.updateSchedule(id, schedule);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedSchedule));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByDoctorId(@PathVariable Long doctorId) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByDate(
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByDate(date);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByDoctorIdAndDate(
            @PathVariable Long doctorId,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByDoctorIdAndDate(doctorId, date);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getSchedulesByStatus(@PathVariable String status) {
        List<ScheduleResponse> schedules = scheduleService.getSchedulesByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(schedules));
    }
}
