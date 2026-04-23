package com.exclusive.blank.service;

import com.exclusive.blank.model.Appointment;
import com.exclusive.blank.repository.AppointmentRepository;
import com.exclusive.blank.model.Schedule;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ScheduleService scheduleService;

    public List<Appointment> getAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment createAppointment(Appointment appointment) {
        // 检查排班是否存在且状态为ACTIVE
        Schedule schedule = scheduleService.getScheduleById(appointment.getSchedule().getId()).orElseThrow();
        if (!"ACTIVE".equals(schedule.getStatus())) {
            throw new RuntimeException("排班已取消");
        }

        // 检查排班是否已满
        if (schedule.getAvailableSlots() <= 0) {
            throw new RuntimeException("排班已满");
        }

        // 创建预约
        appointment.setStatus("PENDING");
        Appointment savedAppointment = appointmentRepository.save(appointment);

        // 更新排班可用预约数
        scheduleService.updateAvailableSlots(schedule.getId(), -1);

        return savedAppointment;
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRepository.findById(id).orElseThrow();
        
        if (appointment.getStatus() != null) {
            String oldStatus = existingAppointment.getStatus();
            existingAppointment.setStatus(appointment.getStatus());

            // 如果预约被取消，恢复排班可用预约数
            if ("CANCELLED".equals(appointment.getStatus()) && !"CANCELLED".equals(oldStatus)) {
                Schedule schedule = existingAppointment.getSchedule();
                scheduleService.updateAvailableSlots(schedule.getId(), 1);
            }
        }

        return appointmentRepository.save(existingAppointment);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id).orElseThrow();
        
        // 如果预约状态不是已取消，恢复排班可用预约数
        if (!"CANCELLED".equals(appointment.getStatus())) {
            Schedule schedule = appointment.getSchedule();
            scheduleService.updateAvailableSlots(schedule.getId(), 1);
        }

        appointmentRepository.deleteById(id);
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        return appointmentRepository.findByPatientId(patientId);
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        return appointmentRepository.findByDoctorId(doctorId);
    }

    public List<Appointment> getAppointmentsByScheduleId(Long scheduleId) {
        return appointmentRepository.findByScheduleId(scheduleId);
    }

    public List<Appointment> getAppointmentsByStatus(String status) {
        return appointmentRepository.findByStatus(status);
    }

    public List<Appointment> getAppointmentsByPatientIdAndStatus(Long patientId, String status) {
        return appointmentRepository.findByPatientIdAndStatus(patientId, status);
    }

    public List<Appointment> getAppointmentsByTimeRange(LocalDateTime start, LocalDateTime end) {
        return appointmentRepository.findByAppointmentTimeBetween(start, end);
    }
}