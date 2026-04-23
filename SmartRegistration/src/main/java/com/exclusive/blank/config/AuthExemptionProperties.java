package com.exclusive.blank.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import jakarta.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

@Component
@ConfigurationProperties(prefix = "auth.exemption")
@Data
public class AuthExemptionProperties {

    private List<ExemptionRule> rules = new ArrayList<>();

    private boolean enableLogging = true;

    private boolean enableDynamicReload = true;

    @PostConstruct
    public void init() {
        validateConfiguration();
    }

    public void validateConfiguration() {
        if (rules == null) {
            rules = new ArrayList<>();
            return;
        }
        for (ExemptionRule rule : rules) {
            if (rule.getPath() == null || rule.getPath().trim().isEmpty()) {
                throw new IllegalStateException("豁免规则的路径不能为空");
            }
            if (rule.getHttpMethods() == null || rule.getHttpMethods().isEmpty()) {
                rule.setHttpMethods(List.of("GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"));
            }
        }
    }

    public List<ExemptionRule> getRules() {
        return rules;
    }

    public void setRules(List<ExemptionRule> rules) {
        this.rules = rules != null ? rules : new ArrayList<>();
    }

    @Data
    public static class ExemptionRule {
        private String path;
        private List<String> httpMethods = new ArrayList<>();
        private String description;
        private boolean enabled = true;

        @com.fasterxml.jackson.annotation.JsonProperty("pattern-type")
        private String patternType = "EXACT";

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public List<String> getHttpMethods() {
            return httpMethods;
        }

        public void setHttpMethods(List<String> httpMethods) {
            this.httpMethods = httpMethods != null ? httpMethods : new ArrayList<>();
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public boolean isEnabled() {
            return enabled;
        }

        public void setEnabled(boolean enabled) {
            this.enabled = enabled;
        }

        public String getPatternType() {
            return patternType;
        }

        public void setPatternType(String patternType) {
            this.patternType = patternType != null ? patternType : "EXACT";
        }
    }
}
