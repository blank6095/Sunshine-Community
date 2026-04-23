package com.exclusive.blank.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/health")
public class HealthController {

    @GetMapping
    public ResponseEntity<Map<String, Object>> healthCheck() {
        Map<String, Object> healthStatus = new HashMap<>();
        healthStatus.put("status", "UP");
        healthStatus.put("timestamp", LocalDateTime.now());
        healthStatus.put("service", "SmartRegistration");
        healthStatus.put("version", "1.0.0");
        healthStatus.put("environment", "development");

        return ResponseEntity.ok(healthStatus);
    }

    @GetMapping("/info")
    public ResponseEntity<Map<String, Object>> getInfo() {
        Map<String, Object> info = new HashMap<>();
        info.put("appName", "智能挂号预约系统");
        info.put("version", "1.0.0");
        info.put("description", "基于Spring Boot的智能挂号预约系统后端API");
        info.put("techStack", "Spring Boot, Spring Security, JPA, MySQL, JWT");

        return ResponseEntity.ok(info);
    }

    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("pong");
    }
}
