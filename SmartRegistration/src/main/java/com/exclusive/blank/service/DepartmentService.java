package com.exclusive.blank.service;

import com.exclusive.blank.model.Department;
import com.exclusive.blank.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DepartmentService {

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Department> getDepartments() {
        return departmentRepository.findAll();
    }

    public Optional<Department> getDepartmentById(Long id) {
        return departmentRepository.findById(id);
    }

    public Department createDepartment(Department department) {
        department.setStatus("ACTIVE");
        return departmentRepository.save(department);
    }

    public Department updateDepartment(Long id, Department department) {
        Department existingDepartment = departmentRepository.findById(id).orElseThrow();
        
        if (department.getName() != null) {
            existingDepartment.setName(department.getName());
        }
        if (department.getDescription() != null) {
            existingDepartment.setDescription(department.getDescription());
        }
        if (department.getStatus() != null) {
            existingDepartment.setStatus(department.getStatus());
        }

        return departmentRepository.save(existingDepartment);
    }

    public void deleteDepartment(Long id) {
        departmentRepository.deleteById(id);
    }

    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }
}