package com.exclusive.blank.controller;

import com.exclusive.blank.config.AuthExemptionProperties;
import com.exclusive.blank.config.AuthExemptionProperties.ExemptionRule;
import com.exclusive.blank.service.AuthExemptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/admin/auth-exemption")
@PreAuthorize("hasAuthority('ADMIN')")
public class AuthExemptionController {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(AuthExemptionController.class);

    @Autowired
    private AuthExemptionService authExemptionService;

    @Autowired
    private AuthExemptionProperties exemptionProperties;

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getExemptionStatus() {
        return ResponseEntity.ok(authExemptionService.getExemptionStatus());
    }

    @GetMapping("/rules")
    public ResponseEntity<List<ExemptionRule>> getAllRules() {
        return ResponseEntity.ok(authExemptionService.getAllRules());
    }

    @PostMapping("/rules")
    public ResponseEntity<Map<String, Object>> addRule(@RequestBody ExemptionRule rule) {
        Map<String, Object> response = new HashMap<>();

        if (rule.getPath() == null || rule.getPath().trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "路径不能为空");
            return ResponseEntity.badRequest().body(response);
        }

        if (!validateRule(rule)) {
            response.put("success", false);
            response.put("message", "规则配置无效，请检查路径格式和HTTP方法");
            return ResponseEntity.badRequest().body(response);
        }

        if (rule.getPatternType() == null || rule.getPatternType().trim().isEmpty()) {
            rule.setPatternType("EXACT");
        }

        if (rule.getHttpMethods() == null || rule.getHttpMethods().isEmpty()) {
            rule.setHttpMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
        }

        boolean success = authExemptionService.addRule(rule);

        if (success) {
            logger.info("管理员添加认证豁免规则: path={}, patternType={}, methods={}",
                rule.getPath(), rule.getPatternType(), rule.getHttpMethods());
            response.put("success", true);
            response.put("message", "豁免规则添加成功");
            response.put("rule", rule);
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "豁免规则添加失败");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    @DeleteMapping("/rules")
    public ResponseEntity<Map<String, Object>> removeRule(
            @RequestParam String path,
            @RequestParam(defaultValue = "EXACT") String patternType) {
        Map<String, Object> response = new HashMap<>();

        boolean success = authExemptionService.removeRule(path, patternType);

        if (success) {
            logger.info("管理员删除认证豁免规则: path={}, patternType={}", path, patternType);
            response.put("success", true);
            response.put("message", "豁免规则删除成功");
        } else {
            response.put("success", false);
            response.put("message", "豁免规则删除失败：未找到匹配的规则");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/reload")
    public ResponseEntity<Map<String, Object>> reloadConfiguration() {
        Map<String, Object> response = new HashMap<>();

        try {
            exemptionProperties.validateConfiguration();
            authExemptionService.reloadRules();
            logger.info("管理员重新加载认证豁免配置");
            response.put("success", true);
            response.put("message", "配置重新加载成功");
            response.put("status", authExemptionService.getExemptionStatus());
        } catch (Exception e) {
            logger.error("重新加载认证豁免配置失败: {}", e.getMessage());
            response.put("success", false);
            response.put("message", "配置重新加载失败：" + e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validateConfiguration() {
        Map<String, Object> response = new HashMap<>();

        try {
            exemptionProperties.validateConfiguration();
            response.put("success", true);
            response.put("message", "配置验证通过");
            response.put("totalRules", exemptionProperties.getRules().size());
            response.put("loggingEnabled", exemptionProperties.isEnableLogging());
            response.put("dynamicReloadEnabled", exemptionProperties.isEnableDynamicReload());
        } catch (IllegalStateException e) {
            response.put("success", false);
            response.put("message", "配置验证失败：" + e.getMessage());
            response.put("error", e.getMessage());
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/test")
    public ResponseEntity<Map<String, Object>> testExemption(
            @RequestParam String path,
            @RequestParam(defaultValue = "GET") String httpMethod) {
        Map<String, Object> response = new HashMap<>();

        boolean isExempt = authExemptionService.isExempt(path, httpMethod);

        response.put("path", path);
        response.put("httpMethod", httpMethod);
        response.put("isExempt", isExempt);
        response.put("message", isExempt ? "该路径豁免认证" : "该路径需要认证");

        return ResponseEntity.ok(response);
    }

    private boolean validateRule(ExemptionRule rule) {
        if (rule.getPath() == null || rule.getPath().trim().isEmpty()) {
            return false;
        }

        String patternType = rule.getPatternType();
        if (patternType == null || (!patternType.equalsIgnoreCase("EXACT") &&
            !patternType.equalsIgnoreCase("WILDCARD") && !patternType.equalsIgnoreCase("ANT"))) {
            return false;
        }

        if (rule.getHttpMethods() != null && !rule.getHttpMethods().isEmpty()) {
            List<String> validMethods = List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS", "HEAD");
            for (String method : rule.getHttpMethods()) {
                if (!validMethods.contains(method.toUpperCase())) {
                    return false;
                }
            }
        }

        return true;
    }
}
