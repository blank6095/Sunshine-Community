package com.exclusive.blank.controller;

import com.exclusive.blank.dto.ApiResponse;
import com.exclusive.blank.dto.DepartmentResponse;
import com.exclusive.blank.model.Department;
import com.exclusive.blank.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
public class DepartmentController {

    @Autowired
    private DepartmentService departmentService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<DepartmentResponse>>> getDepartments() {
        List<DepartmentResponse> departments = departmentService.getDepartments();
        return ResponseEntity.ok(ApiResponse.success(departments));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<DepartmentResponse>> getDepartmentById(@PathVariable Long id) {
        DepartmentResponse department = departmentService.getDepartmentById(id);
        return ResponseEntity.ok(ApiResponse.success(department));
    }

    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> createDepartment(@RequestBody Department department) {
        DepartmentResponse createdDepartment = departmentService.createDepartment(department);
        return ResponseEntity.status(201).body(ApiResponse.created(createdDepartment));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<DepartmentResponse>> updateDepartment(@PathVariable Long id, @RequestBody Department department) {
        DepartmentResponse updatedDepartment = departmentService.updateDepartment(id, department);
        return ResponseEntity.ok(ApiResponse.success("更新成功", updatedDepartment));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> deleteDepartment(@PathVariable Long id) {
        departmentService.deleteDepartment(id);
        return ResponseEntity.ok(ApiResponse.success("删除成功", null));
    }
}
