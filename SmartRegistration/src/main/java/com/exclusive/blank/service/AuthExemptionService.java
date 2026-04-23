package com.exclusive.blank.service;

import com.exclusive.blank.config.AuthExemptionProperties;
import com.exclusive.blank.config.AuthExemptionProperties.ExemptionRule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuthExemptionService {

    private static final Logger logger = LoggerFactory.getLogger(AuthExemptionService.class);

    @Autowired
    private AuthExemptionProperties exemptionProperties;

    private final Map<String, ExemptionRule> activeRules = new ConcurrentHashMap<>();

    private volatile long lastConfigVersion = 0;

    @PostConstruct
    public void init() {
        reloadRules();
    }

    public void reloadRules() {
        logger.info("重新加载认证豁免配置规则");
        activeRules.clear();

        if (exemptionProperties == null) {
            logger.warn("exemptionProperties为空，跳过规则加载");
            return;
        }

        List<ExemptionRule> rules = exemptionProperties.getRules();
        if (rules != null) {
            for (ExemptionRule rule : rules) {
                if (rule.isEnabled()) {
                    String key = generateRuleKey(rule.getPath(), rule.getPatternType());
                    activeRules.put(key, rule);
                    logger.info("已加载豁免规则: path={}, patternType={}, methods={}",
                        rule.getPath(), rule.getPatternType(), rule.getHttpMethods());
                }
            }
        }

        lastConfigVersion++;
        logger.info("认证豁免配置重新加载完成，共加载 {} 条规则", activeRules.size());
    }

    public boolean isExempt(String path, String httpMethod) {
        if (activeRules.isEmpty()) {
            return false;
        }

        String normalizedPath = normalizePath(path);
        String normalizedMethod = httpMethod.toUpperCase();

        for (ExemptionRule rule : activeRules.values()) {
            if (matchesPath(normalizedPath, rule.getPath(), rule.getPatternType())) {
                if (rule.getHttpMethods() == null || rule.getHttpMethods().isEmpty() ||
                    rule.getHttpMethods().stream().anyMatch(m -> m.equalsIgnoreCase(normalizedMethod))) {
                    if (exemptionProperties.isEnableLogging()) {
                        logger.info("请求路径 {} (方法: {}) 匹配豁免规则: {}",
                            path, httpMethod, rule.getDescription());
                    }
                    return true;
                }
            }
        }

        return false;
    }

    private boolean matchesPath(String requestPath, String rulePath, String patternType) {
        if ("EXACT".equalsIgnoreCase(patternType)) {
            return requestPath.equals(rulePath);
        } else if ("WILDCARD".equalsIgnoreCase(patternType)) {
            return matchWildcard(requestPath, rulePath);
        } else if ("ANT".equalsIgnoreCase(patternType)) {
            return matchAntPattern(requestPath, rulePath);
        }
        return false;
    }

    private boolean matchWildcard(String requestPath, String pattern) {
        if (pattern.endsWith("**")) {
            String prefix = pattern.substring(0, pattern.length() - 2);
            return requestPath.startsWith(prefix);
        } else if (pattern.startsWith("**")) {
            String suffix = pattern.substring(2);
            return requestPath.endsWith(suffix);
        } else if (pattern.contains("**")) {
            String[] parts = pattern.split("\\*\\*");
            for (String part : parts) {
                if (!part.isEmpty() && !requestPath.contains(part)) {
                    return false;
                }
            }
            return true;
        } else {
            return requestPath.contains(pattern);
        }
    }

    private boolean matchAntPattern(String requestPath, String pattern) {
        String[] patternParts = pattern.split("/");
        String[] pathParts = requestPath.split("/");

        int patternIndex = 0;
        int pathIndex = 0;

        while (patternIndex < patternParts.length && pathIndex < pathParts.length) {
            String patternPart = patternParts[patternIndex];
            String pathPart = pathParts[pathIndex];

            if ("**".equals(patternPart)) {
                if (patternIndex == patternParts.length - 1) {
                    return true;
                }
                patternIndex++;
                while (pathIndex < pathParts.length) {
                    if (matchAntPattern(joinParts(pathParts, pathIndex), joinParts(patternParts, patternIndex))) {
                        return true;
                    }
                    pathIndex++;
                }
                return false;
            } else if ("*".equals(patternPart)) {
                patternIndex++;
                pathIndex++;
            } else if (!patternPart.equals(pathPart)) {
                return false;
            } else {
                patternIndex++;
                pathIndex++;
            }
        }

        return patternIndex == patternParts.length && pathIndex == pathParts.length;
    }

    private String joinParts(String[] parts, int startIndex) {
        StringBuilder sb = new StringBuilder();
        for (int i = startIndex; i < parts.length; i++) {
            if (i > startIndex) {
                sb.append("/");
            }
            sb.append(parts[i]);
        }
        return sb.toString();
    }

    private String normalizePath(String path) {
        if (path == null) {
            return "";
        }
        String normalized = path;
        if (normalized.endsWith("/") && normalized.length() > 1) {
            normalized = normalized.substring(0, normalized.length() - 1);
        }
        return normalized;
    }

    private String generateRuleKey(String path, String patternType) {
        return patternType + ":" + path;
    }

    public List<ExemptionRule> getAllRules() {
        return new ArrayList<>(activeRules.values());
    }

    public Map<String, Object> getExemptionStatus() {
        Map<String, Object> status = new ConcurrentHashMap<>();
        status.put("totalRules", activeRules.size());
        status.put("loggingEnabled", exemptionProperties.isEnableLogging());
        status.put("dynamicReloadEnabled", exemptionProperties.isEnableDynamicReload());
        status.put("lastConfigVersion", lastConfigVersion);
        status.put("rules", getAllRules());
        return status;
    }

    public boolean addRule(ExemptionRule rule) {
        try {
            if (rule.getPath() == null || rule.getPath().trim().isEmpty()) {
                logger.error("添加豁免规则失败: 路径不能为空");
                return false;
            }
            String key = generateRuleKey(rule.getPath(), rule.getPatternType());
            activeRules.put(key, rule);
            logger.info("添加豁免规则成功: path={}, patternType={}", rule.getPath(), rule.getPatternType());
            return true;
        } catch (Exception e) {
            logger.error("添加豁免规则异常: {}", e.getMessage());
            return false;
        }
    }

    public boolean removeRule(String path, String patternType) {
        String key = generateRuleKey(path, patternType);
        if (activeRules.remove(key) != null) {
            logger.info("删除豁免规则成功: path={}, patternType={}", path, patternType);
            return true;
        }
        logger.warn("删除豁免规则失败: 未找到匹配的规则 path={}, patternType={}", path, patternType);
        return false;
    }

    @Scheduled(fixedRate = 60000)
    public void checkConfigUpdate() {
        if (exemptionProperties.isEnableDynamicReload()) {
            // 配置重载检查逻辑
        }
    }
}
