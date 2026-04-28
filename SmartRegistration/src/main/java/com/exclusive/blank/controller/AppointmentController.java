package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.dto.AppointmentResponse;
import com.exclusive.blank.model.Appointment;
import com.exclusive.blank.service.AppointmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointments() {
        List<AppointmentResponse> appointments = appointmentService.getAppointments();
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> getAppointmentById(@PathVariable Long id) {
        AppointmentResponse appointment = appointmentService.getAppointmentById(id);
        return ResponseEntity.ok(ApiResponse.success(appointment));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('PATIENT')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> createAppointment(
            @RequestBody Appointment appointment,
            @AuthenticationPrincipal UserDetails currentUser) {
        AppointmentResponse createdAppointment = appointmentService.createAppointment(appointment, currentUser);
        return ResponseEntity.status(201).body(ApiResponse.created(createdAppointment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<AppointmentResponse>> updateAppointment(@PathVariable Long id, @RequestBody Appointment appointment) {
        AppointmentResponse updatedAppointment = appointmentService.updateAppointment(id, appointment);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedAppointment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteAppointment(@PathVariable Long id) {
        appointmentService.deleteAppointment(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }

    @GetMapping("/patient/{patientId}")
    @PreAuthorize("hasAuthority('ADMIN') or #patientId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByPatientId(@PathVariable Long patientId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatientId(patientId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/doctor/{doctorId}")
    @PreAuthorize("hasAuthority('ADMIN') or #doctorId == @doctorService.getDoctorByUserId(authentication.principal.id).userId")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByDoctorId(@PathVariable Long doctorId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/schedule/{scheduleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByScheduleId(@PathVariable Long scheduleId) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByScheduleId(scheduleId);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/status/{status}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByStatus(@PathVariable String status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/patient/{patientId}/status/{status}")
    @PreAuthorize("hasAuthority('ADMIN') or #patientId == authentication.principal.id")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByPatientIdAndStatus(
            @PathVariable Long patientId, @PathVariable String status) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByPatientIdAndStatus(patientId, status);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }

    @GetMapping("/time-range")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<List<AppointmentResponse>>> getAppointmentsByTimeRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        List<AppointmentResponse> appointments = appointmentService.getAppointmentsByTimeRange(start, end);
        return ResponseEntity.ok(ApiResponse.success(appointments));
    }
}
