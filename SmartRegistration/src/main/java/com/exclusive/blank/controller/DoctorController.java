package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.dto.DoctorResponse;
import com.exclusive.blank.model.Doctor;
import com.exclusive.blank.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctors() {
        List<DoctorResponse> doctors = doctorService.getDoctors();
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DoctorResponse>> getDoctorById(@PathVariable Long id) {
        DoctorResponse doctor = doctorService.getDoctorById(id);
        return ResponseEntity.ok(ApiResponse.success(doctor));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<DoctorResponse>> createDoctor(@RequestBody Doctor doctor) {
        DoctorResponse createdDoctor = doctorService.createDoctor(doctor);
        return ResponseEntity.status(201).body(ApiResponse.created(createdDoctor));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or @doctorService.getDoctorById(#id).getUserId() == @userService.getCurrentUser().getId()")
    public ResponseEntity<ApiResponse<DoctorResponse>> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        DoctorResponse updatedDoctor = doctorService.updateDoctor(id, doctor);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedDoctor));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteDoctor(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }

    @GetMapping("/department/{departmentId}")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsByDepartmentId(@PathVariable Long departmentId) {
        List<DoctorResponse> doctors = doctorService.getDoctorsByDepartmentId(departmentId);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }

    @GetMapping("/status/{status}")
    public ResponseEntity<ApiResponse<List<DoctorResponse>>> getDoctorsByStatus(@PathVariable String status) {
        List<DoctorResponse> doctors = doctorService.getDoctorsByStatus(status);
        return ResponseEntity.ok(ApiResponse.success(doctors));
    }
}
