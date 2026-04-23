package com.exclusive.blank.repository;

import com.exclusive.blank.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    List<Doctor> findByDepartmentId(Long departmentId);
    List<Doctor> findByStatus(String status);
}