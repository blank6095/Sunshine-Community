package com.exclusive.blank.service;

import com.exclusive.blank.model.Doctor;
import com.exclusive.blank.repository.DoctorRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getDoctors() {
        return doctorRepository.findAll();
    }

    public Optional<Doctor> getDoctorById(Long id) {
        return doctorRepository.findById(id);
    }

    public Doctor createDoctor(Doctor doctor) {
        doctor.setStatus("ACTIVE");
        return doctorRepository.save(doctor);
    }

    public Doctor updateDoctor(Long id, Doctor doctor) {
        Doctor existingDoctor = doctorRepository.findById(id).orElseThrow();
        
        if (doctor.getDepartment() != null) {
            existingDoctor.setDepartment(doctor.getDepartment());
        }
        if (doctor.getTitle() != null) {
            existingDoctor.setTitle(doctor.getTitle());
        }
        if (doctor.getSpecialty() != null) {
            existingDoctor.setSpecialty(doctor.getSpecialty());
        }
        if (doctor.getBio() != null) {
            existingDoctor.setBio(doctor.getBio());
        }
        if (doctor.getStatus() != null) {
            existingDoctor.setStatus(doctor.getStatus());
        }

        return doctorRepository.save(existingDoctor);
    }

    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }

    public Optional<Doctor> getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId);
    }

    public List<Doctor> getDoctorsByDepartmentId(Long departmentId) {
        return doctorRepository.findByDepartmentId(departmentId);
    }

    public List<Doctor> getDoctorsByStatus(String status) {
        return doctorRepository.findByStatus(status);
    }
}