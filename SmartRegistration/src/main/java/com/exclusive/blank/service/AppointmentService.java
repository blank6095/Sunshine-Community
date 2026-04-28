package com.exclusive.blank.service;

import com.exclusive.blank.dto.AppointmentResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.Appointment;
import com.exclusive.blank.model.Schedule;
import com.exclusive.blank.model.User;
import com.exclusive.blank.repository.AppointmentRepository;
import com.exclusive.blank.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentService.class);

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private ScheduleService scheduleService;

    @Autowired
    private UserRepository userRepository;

    public List<AppointmentResponse> getAppointments() {
        List<Appointment> appointments = appointmentRepository.findAll();
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public AppointmentResponse getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("预约不存在: id={}", id);
                    return new BusinessException(ErrorCode.APPOINTMENT_NOT_FOUND);
                });
        return toAppointmentResponse(appointment);
    }

    public AppointmentResponse createAppointment(Appointment appointment, UserDetails currentUser) {
        if (appointment.getPatient() == null || appointment.getPatient().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "患者ID不能为空");
        }

        if (appointment.getDoctor() == null || appointment.getDoctor().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "医生ID不能为空");
        }

        if (appointment.getSchedule() == null || appointment.getSchedule().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "排班ID不能为空");
        }

        User authenticatedUser = userRepository.findByUsername(currentUser.getUsername())
            .orElseThrow(() -> new BusinessException(ErrorCode.BAD_REQUEST, "当前用户不存在"));

        if (!authenticatedUser.getId().equals(appointment.getPatient().getId())) {
            logger.warn("权限拒绝: 当前用户尝试为其他患者创建预约 | 当前用户ID: {}, 请求患者ID: {}",
                authenticatedUser.getId(), appointment.getPatient().getId());
            throw new BusinessException(ErrorCode.PERMISSION_DENIED, "只能为自己创建预约");
        }

        Schedule schedule = scheduleService.getScheduleEntity(appointment.getSchedule().getId());
        if (!"ACTIVE".equals(schedule.getStatus())) {
            logger.warn("排班已取消: scheduleId={}", schedule.getId());
            throw new BusinessException(ErrorCode.SCHEDULE_CANCELLED);
        }

        if (schedule.getAvailableSlots() <= 0) {
            logger.warn("排班已满: scheduleId={}", schedule.getId());
            throw new BusinessException(ErrorCode.SCHEDULE_FULL);
        }

        if (appointment.getAppointmentTime() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "预约时间不能为空");
        }

        appointment.setStatus("PENDING");
        Appointment savedAppointment = appointmentRepository.save(appointment);

        scheduleService.updateAvailableSlots(schedule.getId(), -1);

        logger.info("预约创建成功: id={}, patientId={}, doctorId={}", savedAppointment.getId(),
                appointment.getPatient().getId(), appointment.getDoctor().getId());
        return toAppointmentResponse(savedAppointment);
    }

    public AppointmentResponse updateAppointment(Long id, Appointment appointment) {
        Appointment existingAppointment = appointmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("预约不存在: id={}", id);
                    return new BusinessException(ErrorCode.APPOINTMENT_NOT_FOUND);
                });

        // 检查预约是否已完成或已取消
        if ("COMPLETED".equals(existingAppointment.getStatus())) {
            throw new BusinessException(ErrorCode.APPOINTMENT_COMPLETED);
        }

        if ("CANCELLED".equals(existingAppointment.getStatus())) {
            throw new BusinessException(ErrorCode.APPOINTMENT_CANCELLED);
        }

        if (appointment.getStatus() != null) {
            String oldStatus = existingAppointment.getStatus();
            existingAppointment.setStatus(appointment.getStatus());

            // 如果预约被取消，恢复排班可用预约数
            if ("CANCELLED".equals(appointment.getStatus()) && !"CANCELLED".equals(oldStatus)) {
                Schedule schedule = existingAppointment.getSchedule();
                scheduleService.updateAvailableSlots(schedule.getId(), 1);
            }
        }

        if (appointment.getAppointmentTime() != null) {
            existingAppointment.setAppointmentTime(appointment.getAppointmentTime());
        }

        if (appointment.getSymptoms() != null) {
            existingAppointment.setSymptoms(appointment.getSymptoms());
        }

        Appointment updated = appointmentRepository.save(existingAppointment);
        logger.info("预约更新成功: id={}", updated.getId());
        return toAppointmentResponse(updated);
    }

    public void deleteAppointment(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("预约不存在: id={}", id);
                    return new BusinessException(ErrorCode.APPOINTMENT_NOT_FOUND);
                });

        // 如果预约状态不是已取消，恢复排班可用预约数
        if (!"CANCELLED".equals(appointment.getStatus())) {
            Schedule schedule = appointment.getSchedule();
            scheduleService.updateAvailableSlots(schedule.getId(), 1);
        }

        appointmentRepository.deleteById(id);
        logger.info("预约删除成功: id={}", id);
    }

    public List<AppointmentResponse> getAppointmentsByPatientId(Long patientId) {
        if (patientId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "患者ID不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByPatientId(patientId);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByDoctorId(Long doctorId) {
        if (doctorId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "医生ID不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByDoctorId(doctorId);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByScheduleId(Long scheduleId) {
        if (scheduleId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "排班ID不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByScheduleId(scheduleId);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "状态不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByStatus(status);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByPatientIdAndStatus(Long patientId, String status) {
        if (patientId == null || status == null || status.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "患者ID和状态不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByPatientIdAndStatus(patientId, status);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    public List<AppointmentResponse> getAppointmentsByTimeRange(LocalDateTime start, LocalDateTime end) {
        if (start == null || end == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "开始时间和结束时间不能为空");
        }

        List<Appointment> appointments = appointmentRepository.findByAppointmentTimeBetween(start, end);
        return appointments.stream()
                .map(this::toAppointmentResponse)
                .collect(Collectors.toList());
    }

    private AppointmentResponse toAppointmentResponse(Appointment appointment) {
        return new AppointmentResponse(
                appointment.getId(),
                appointment.getPatient().getId(),
                appointment.getPatient().getName(),
                appointment.getDoctor().getId(),
                appointment.getDoctor().getUser().getName(),
                appointment.getDoctor().getDepartment().getName(),
                appointment.getSchedule().getId(),
                appointment.getAppointmentTime(),
                appointment.getStatus(),
                appointment.getSymptoms(),
                appointment.getCreatedAt(),
                appointment.getUpdatedAt()
        );
    }
}
