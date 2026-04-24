package com.exclusive.blank.service;

import com.exclusive.blank.dto.DepartmentResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.Department;
import com.exclusive.blank.repository.DepartmentRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DepartmentService {

    private static final Logger logger = LoggerFactory.getLogger(DepartmentService.class);

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<DepartmentResponse> getDepartments() {
        List<Department> departments = departmentRepository.findAll();
        return departments.stream()
                .map(this::toDepartmentResponse)
                .collect(Collectors.toList());
    }

    public DepartmentResponse getDepartmentById(Long id) {
        Department department = departmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("科室不存在: id={}", id);
                    return new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
                });
        return toDepartmentResponse(department);
    }

    public DepartmentResponse createDepartment(Department department) {
        if (department.getName() == null || department.getName().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "科室名称不能为空");
        }

        if (department.getName().length() > 50) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "科室名称不能超过50个字符");
        }

        Optional<Department> existing = departmentRepository.findByName(department.getName());
        if (existing.isPresent()) {
            logger.warn("科室名称已存在: {}", department.getName());
            throw new BusinessException(ErrorCode.DEPARTMENT_NAME_EXISTS);
        }

        department.setStatus("ACTIVE");

        Department saved = departmentRepository.save(department);
        logger.info("科室创建成功: id={}, name={}", saved.getId(), saved.getName());
        return toDepartmentResponse(saved);
    }

    public DepartmentResponse updateDepartment(Long id, Department department) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("科室不存在: id={}", id);
                    return new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
                });

        if (department.getName() != null) {
            if (department.getName().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "科室名称不能为空");
            }
            if (department.getName().length() > 50) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "科室名称不能超过50个字符");
            }

            Optional<Department> duplicate = departmentRepository.findByName(department.getName());
            if (duplicate.isPresent() && !duplicate.get().getId().equals(id)) {
                logger.warn("科室名称已存在: {}", department.getName());
                throw new BusinessException(ErrorCode.DEPARTMENT_NAME_EXISTS);
            }
            existingDepartment.setName(department.getName());
        }

        if (department.getDescription() != null) {
            existingDepartment.setDescription(department.getDescription());
        }

        if (department.getStatus() != null) {
            if (!"ACTIVE".equals(department.getStatus()) && !"INACTIVE".equals(department.getStatus())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "状态只能是ACTIVE或INACTIVE");
            }
            existingDepartment.setStatus(department.getStatus());
        }

        existingDepartment.setUpdatedAt(LocalDateTime.now());

        Department updated = departmentRepository.save(existingDepartment);
        logger.info("科室更新成功: id={}", updated.getId());
        return toDepartmentResponse(updated);
    }

    public void deleteDepartment(Long id) {
        Department existingDepartment = departmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("科室不存在: id={}", id);
                    return new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
                });

        departmentRepository.deleteById(id);
        logger.info("科室删除成功: id={}", id);
    }

    public Optional<Department> getDepartmentByName(String name) {
        return departmentRepository.findByName(name);
    }

    private DepartmentResponse toDepartmentResponse(Department department) {
        return new DepartmentResponse(
                department.getId(),
                department.getName(),
                department.getDescription(),
                department.getStatus(),
                department.getCreatedAt(),
                department.getUpdatedAt()
        );
    }
}
