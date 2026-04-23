package com.exclusive.blank.repository;

import com.exclusive.blank.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDateTime;
import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatientId(Long patientId);
    List<Appointment> findByDoctorId(Long doctorId);
    List<Appointment> findByScheduleId(Long scheduleId);
    List<Appointment> findByStatus(String status);
    List<Appointment> findByPatientIdAndStatus(Long patientId, String status);
    List<Appointment> findByAppointmentTimeBetween(LocalDateTime start, LocalDateTime end);
}