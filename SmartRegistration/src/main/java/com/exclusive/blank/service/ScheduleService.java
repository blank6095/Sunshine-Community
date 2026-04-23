package com.exclusive.blank.service;

import com.exclusive.blank.model.Schedule;
import com.exclusive.blank.repository.ScheduleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class ScheduleService {

    @Autowired
    private ScheduleRepository scheduleRepository;

    public List<Schedule> getSchedules() {
        return scheduleRepository.findAll();
    }

    public Optional<Schedule> getScheduleById(Long id) {
        return scheduleRepository.findById(id);
    }

    public Schedule createSchedule(Schedule schedule) {
        schedule.setStatus("ACTIVE");
        schedule.setAvailableSlots(schedule.getMaxPatients());
        return scheduleRepository.save(schedule);
    }

    public Schedule updateSchedule(Long id, Schedule schedule) {
        Schedule existingSchedule = scheduleRepository.findById(id).orElseThrow();
        
        if (schedule.getStartTime() != null) {
            existingSchedule.setStartTime(schedule.getStartTime());
        }
        if (schedule.getEndTime() != null) {
            existingSchedule.setEndTime(schedule.getEndTime());
        }
        if (schedule.getMaxPatients() != null) {
            existingSchedule.setMaxPatients(schedule.getMaxPatients());
            // 重新计算可用预约数
            int currentAvailable = existingSchedule.getAvailableSlots();
            int newMax = schedule.getMaxPatients();
            existingSchedule.setAvailableSlots(Math.min(currentAvailable, newMax));
        }
        if (schedule.getStatus() != null) {
            existingSchedule.setStatus(schedule.getStatus());
        }

        return scheduleRepository.save(existingSchedule);
    }

    public void deleteSchedule(Long id) {
        scheduleRepository.deleteById(id);
    }

    public List<Schedule> getSchedulesByDoctorId(Long doctorId) {
        return scheduleRepository.findByDoctorId(doctorId);
    }

    public List<Schedule> getSchedulesByDate(LocalDate date) {
        return scheduleRepository.findByDate(date);
    }

    public List<Schedule> getSchedulesByDoctorIdAndDate(Long doctorId, LocalDate date) {
        return scheduleRepository.findByDoctorIdAndDate(doctorId, date);
    }

    public List<Schedule> getSchedulesByStatus(String status) {
        return scheduleRepository.findByStatus(status);
    }

    public Schedule updateAvailableSlots(Long id, int delta) {
        Schedule schedule = scheduleRepository.findById(id).orElseThrow();
        int newAvailableSlots = schedule.getAvailableSlots() + delta;
        schedule.setAvailableSlots(Math.max(0, Math.min(newAvailableSlots, schedule.getMaxPatients())));
        return scheduleRepository.save(schedule);
    }
}