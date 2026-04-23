package com.exclusive.blank.controller;

import com.exclusive.blank.model.Schedule;
import com.exclusive.blank.service.ScheduleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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
    public ResponseEntity<List<Schedule>> getSchedules() {
        List<Schedule> schedules = scheduleService.getSchedules();
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Schedule> getScheduleById(@PathVariable Long id) {
        Schedule schedule = scheduleService.getScheduleById(id).orElseThrow();
        return ResponseEntity.ok(schedule);
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or @scheduleService.getScheduleById(#schedule.doctor.id).get().getDoctor().getUser().getId() == principal.id")
    public ResponseEntity<Schedule> createSchedule(@RequestBody Schedule schedule) {
        Schedule createdSchedule = scheduleService.createSchedule(schedule);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdSchedule);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @scheduleService.getScheduleById(#id).get().getDoctor().getUser().getId() == principal.id")
    public ResponseEntity<Schedule> updateSchedule(@PathVariable Long id, @RequestBody Schedule schedule) {
        Schedule updatedSchedule = scheduleService.updateSchedule(id, schedule);
        return ResponseEntity.ok(updatedSchedule);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @scheduleService.getScheduleById(#id).get().getDoctor().getUser().getId() == principal.id")
    public ResponseEntity<Void> deleteSchedule(@PathVariable Long id) {
        scheduleService.deleteSchedule(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Schedule>> getSchedulesByDoctorId(@PathVariable Long doctorId) {
        List<Schedule> schedules = scheduleService.getSchedulesByDoctorId(doctorId);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/date/{date}")
    public ResponseEntity<List<Schedule>> getSchedulesByDate(@PathVariable LocalDate date) {
        List<Schedule> schedules = scheduleService.getSchedulesByDate(date);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/doctor/{doctorId}/date/{date}")
    public ResponseEntity<List<Schedule>> getSchedulesByDoctorIdAndDate(@PathVariable Long doctorId, @PathVariable LocalDate date) {
        List<Schedule> schedules = scheduleService.getSchedulesByDoctorIdAndDate(doctorId, date);
        return ResponseEntity.ok(schedules);
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<List<Schedule>> getSchedulesByStatus(@PathVariable String status) {
        List<Schedule> schedules = scheduleService.getSchedulesByStatus(status);
        return ResponseEntity.ok(schedules);
    }
}