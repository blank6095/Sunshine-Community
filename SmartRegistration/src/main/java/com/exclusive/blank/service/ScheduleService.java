package com.exclusive.blank.service;

import com.exclusive.blank.dto.ScheduleResponse;
import com.exclusive.blank.exception.BusinessException;
import com.exclusive.blank.exception.ErrorCode;
import com.exclusive.blank.model.Schedule;
import com.exclusive.blank.model.Doctor;
import com.exclusive.blank.repository.ScheduleRepository;
import com.exclusive.blank.repository.DoctorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ScheduleService {

    private static final Logger logger = LoggerFactory.getLogger(ScheduleService.class);

    @Autowired
    private ScheduleRepository scheduleRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public List<ScheduleResponse> getSchedules() {
        List<Schedule> schedules = scheduleRepository.findAll();
        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse getScheduleById(Long id) {
        Schedule schedule = getScheduleEntityById(id);
        return toScheduleResponse(schedule);
    }

    /**
     * Internal method to get Schedule entity (for use by other services)
     */
    public Schedule getScheduleEntity(Long id) {
        return getScheduleEntityById(id);
    }

    public ScheduleResponse createSchedule(Schedule schedule) {
        if (schedule.getDoctor() == null || schedule.getDoctor().getId() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "医生ID不能为空");
        }

        Doctor doctor = doctorRepository.findById(schedule.getDoctor().getId())
                .orElseThrow(() -> {
                    logger.warn("医生不存在: id={}", schedule.getDoctor().getId());
                    return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                });

        if (schedule.getDate() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "日期不能为空");
        }

        if (schedule.getStartTime() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "开始时间不能为空");
        }

        if (schedule.getEndTime() == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "结束时间不能为空");
        }

        if (schedule.getStartTime().isAfter(schedule.getEndTime())) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "开始时间不能晚于结束时间");
        }

        if (schedule.getMaxPatients() == null || schedule.getMaxPatients() <= 0) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "最大预约人数必须大于0");
        }

        schedule.setDoctor(doctor);
        schedule.setStatus("ACTIVE");
        schedule.setAvailableSlots(schedule.getMaxPatients());

        Schedule saved = scheduleRepository.save(schedule);
        logger.info("排班创建成功: id={}, doctorId={}, date={}", saved.getId(), doctor.getId(), saved.getDate());
        return toScheduleResponse(saved);
    }

    public ScheduleResponse updateSchedule(Long id, Schedule schedule) {
        Schedule existingSchedule = getScheduleEntityById(id);

        if (schedule.getDoctor() != null && schedule.getDoctor().getId() != null) {
            Doctor doctor = doctorRepository.findById(schedule.getDoctor().getId())
                    .orElseThrow(() -> {
                        logger.warn("医生不存在: id={}", schedule.getDoctor().getId());
                        return new BusinessException(ErrorCode.DOCTOR_NOT_FOUND);
                    });
            existingSchedule.setDoctor(doctor);
        }

        if (schedule.getDate() != null) {
            existingSchedule.setDate(schedule.getDate());
        }

        if (schedule.getStartTime() != null) {
            if (schedule.getEndTime() != null && schedule.getStartTime().isAfter(schedule.getEndTime())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "开始时间不能晚于结束时间");
            }
            existingSchedule.setStartTime(schedule.getStartTime());
        }

        if (schedule.getEndTime() != null) {
            existingSchedule.setEndTime(schedule.getEndTime());
        }

        if (schedule.getMaxPatients() != null) {
            if (schedule.getMaxPatients() <= 0) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "最大预约人数必须大于0");
            }
            int currentAvailable = existingSchedule.getAvailableSlots();
            int newMax = schedule.getMaxPatients();
            existingSchedule.setMaxPatients(newMax);
            existingSchedule.setAvailableSlots(Math.min(currentAvailable, newMax));
        }

        if (schedule.getStatus() != null) {
            if (!"ACTIVE".equals(schedule.getStatus()) && !"CANCELLED".equals(schedule.getStatus())) {
                throw new BusinessException(ErrorCode.BAD_REQUEST, "状态只能是ACTIVE或CANCELLED");
            }
            existingSchedule.setStatus(schedule.getStatus());
        }

        Schedule updated = scheduleRepository.save(existingSchedule);
        logger.info("排班更新成功: id={}", updated.getId());
        return toScheduleResponse(updated);
    }

    public void deleteSchedule(Long id) {
        Schedule existingSchedule = getScheduleEntityById(id);
        scheduleRepository.deleteById(id);
        logger.info("排班删除成功: id={}", id);
    }

    public List<ScheduleResponse> getSchedulesByDoctorId(Long doctorId) {
        if (doctorId == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "医生ID不能为空");
        }

        List<Schedule> schedules = scheduleRepository.findByDoctorId(doctorId);
        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getSchedulesByDate(LocalDate date) {
        if (date == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "日期不能为空");
        }

        List<Schedule> schedules = scheduleRepository.findByDate(date);
        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getSchedulesByDoctorIdAndDate(Long doctorId, LocalDate date) {
        if (doctorId == null || date == null) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "医生ID和日期不能为空");
        }

        List<Schedule> schedules = scheduleRepository.findByDoctorIdAndDate(doctorId, date);
        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public List<ScheduleResponse> getSchedulesByStatus(String status) {
        if (status == null || status.trim().isEmpty()) {
            throw new BusinessException(ErrorCode.BAD_REQUEST, "状态不能为空");
        }

        List<Schedule> schedules = scheduleRepository.findByStatus(status);
        return schedules.stream()
                .map(this::toScheduleResponse)
                .collect(Collectors.toList());
    }

    public ScheduleResponse updateAvailableSlots(Long id, int delta) {
        Schedule schedule = getScheduleEntityById(id);
        int newAvailableSlots = schedule.getAvailableSlots() + delta;
        schedule.setAvailableSlots(Math.max(0, Math.min(newAvailableSlots, schedule.getMaxPatients())));

        Schedule updated = scheduleRepository.save(schedule);
        return toScheduleResponse(updated);
    }

    private Schedule getScheduleEntityById(Long id) {
        return scheduleRepository.findById(id)
                .orElseThrow(() -> {
                    logger.warn("排班不存在: id={}", id);
                    return new BusinessException(ErrorCode.SCHEDULE_NOT_FOUND);
                });
    }

    private ScheduleResponse toScheduleResponse(Schedule schedule) {
        return new ScheduleResponse(
                schedule.getId(),
                schedule.getDoctor().getId(),
                schedule.getDoctor().getUser().getName(),
                schedule.getDoctor().getDepartment().getId(),
                schedule.getDoctor().getDepartment().getName(),
                schedule.getDate(),
                schedule.getStartTime(),
                schedule.getEndTime(),
                schedule.getMaxPatients(),
                schedule.getAvailableSlots(),
                schedule.getStatus(),
                schedule.getCreatedAt(),
                schedule.getUpdatedAt()
        );
    }
}
