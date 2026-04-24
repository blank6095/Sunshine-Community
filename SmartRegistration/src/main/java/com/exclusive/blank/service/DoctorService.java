package com.exclusive.blank.service;

import com.exclusive.blank.dto.DoctorResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.Doctor;
import com.exclusive.blank.model.Department;
import com.exclusive.blank.model.User;
import com.exclusive.blank.repository.DoctorRepository;
import com.exclusive.blank.repository.DepartmentRepository;
import com.exclusive.blank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class DoctorService {

    private static final Logger logger = LoggerFactory.getLogger(DoctorService.class);

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<DoctorResponse> getDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return doctors.stream()
                .map(this::toDoctorResponse)
                .collect(Collectors.toList());
    }

    public DoctorResponse getDoctorById(Long id) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("医生不存在: id={}", id);
                    return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                });
        return toDoctorResponse(doctor);
    }

    public DoctorResponse createDoctor(Doctor doctor) {
        if (doctor.getUser() == null || doctor.getUser().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "用户ID不能为空");
        }

        User user = userRepository.findById(doctor.getUser().getId())
                .orElseThrow(() -> {
                    logger.warn("用户不存在: id={}", doctor.getUser().getId());
                    return new BusinessException(ErrorCode.USER_NOT_FOUND);
                });

        if (!"DOCTOR".equals(user.getRole())) {
            logger.warn("用户不是医生角色: userId={}, role={}", user.getId(), user.getRole());
            throw new BusinessException(ErrorCode.USER_NOT_DOCTOR);
        }

        if (doctor.getDepartment() == null || doctor.getDepartment().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "科室ID不能为空");
        }

        Department department = departmentRepository.findById(doctor.getDepartment().getId())
                .orElseThrow(() -> {
                    logger.warn("科室不存在: id={}", doctor.getDepartment().getId());
                    return new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
                });

        if (doctor.getTitle() == null || doctor.getTitle().trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "职称不能为空");
        }

        Optional<Doctor> existing = doctorRepository.findByUserId(user.getId());
        if (existing.isPresent()) {
            logger.warn("该用户已是医生: userId={}", user.getId());
            throw new BusinessException(ErrorCode.BAD_REQUEST, "该用户已经是医生");
        }

        doctor.setUser(user);
        doctor.setDepartment(department);
        doctor.setStatus("ACTIVE");

        Doctor saved = doctorRepository.save(doctor);
        logger.info("医生创建成功: id={}, userId={}", saved.getId(), user.getId());
        return toDoctorResponse(saved);
    }

    public DoctorResponse updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("医生不存在: id={}", id);
                    return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                });

        if (doctor.getDepartment() != null && doctor.getDepartment().getId() != null) {
            Department department = departmentRepository.findById(doctor.getDepartment().getId())
                    .orElseThrow(() -> {
                        logger.warn("科室不存在: id={}", doctor.getDepartment().getId());
                        return new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
                    });
            existingDoctor.setDepartment(department);
        }

        if (doctor.getTitle() != null) {
            if (doctor.getTitle().trim().isEmpty()) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "职称不能为空");
            }
            existingDoctor.setTitle(doctor.getTitle());
        }

        if (doctor.getSpecialty() != null) {
            existingDoctor.setSpecialty(doctor.getSpecialty());
        }

        if (doctor.getBio() != null) {
            existingDoctor.setBio(doctor.getBio());
        }

        if (doctor.getStatus() != null) {
            if (!"ACTIVE".equals(doctor.getStatus()) && !"INACTIVE".equals(doctor.getStatus())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "状态只能是ACTIVE或INACTIVE");
            }
            existingDoctor.setStatus(doctor.getStatus());
        }

        Doctor updated = doctorRepository.save(existingDoctor);
        logger.info("医生更新成功: id={}", updated.getId());
        return toDoctorResponse(updated);
    }

    public void deleteDoctor(Long id) {
        Doctor existingDoctor = doctorRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("医生不存在: id={}", id);
                    return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                });

        doctorRepository.deleteById(id);
        logger.info("医生删除成功: id={}", id);
    }

    public DoctorResponse getDoctorByUserId(Long userId) {
        Doctor doctor = doctorRepository.findByUserId(userId)
                .orElseThrow(() -> {
                    logger.warn("医生不存在: userId={}", userId);
                    return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                });
        return toDoctorResponse(doctor);
    }

    public List<DoctorResponse> getDoctorsByDepartmentId(Long departmentId) {
        if (departmentId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "科室ID不能为空");
        }

        if (!departmentRepository.existsById(departmentId)) {
            throw new BusinessException(ErrorCode.DEPARTMENT_NOT_FOUND);
        }

        List<Doctor> doctors = doctorRepository.findByDepartmentId(departmentId);
        return doctors.stream()
                .map(this::toDoctorResponse)
                .collect(Collectors.toList());
    }

    public List<DoctorResponse> getDoctorsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "状态不能为空");
        }

        List<Doctor> doctors = doctorRepository.findByStatus(status);
        return doctors.stream()
                .map(this::toDoctorResponse)
                .collect(Collectors.toList());
    }

    private DoctorResponse toDoctorResponse(Doctor doctor) {
        return new DoctorResponse(
                doctor.getId(),
                doctor.getUser().getId(),
                doctor.getUser().getName(),
                doctor.getUser().getPhone(),
                doctor.getUser().getEmail(),
                doctor.getDepartment().getId(),
                doctor.getDepartment().getName(),
                doctor.getTitle(),
                doctor.getSpecialty(),
                doctor.getBio(),
                doctor.getStatus(),
                doctor.getCreatedAt(),
                doctor.getUpdatedAt()
        );
    }
}
