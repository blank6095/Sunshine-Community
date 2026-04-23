package com.exclusive.blank.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import jakarta.annotation.PostConstruct;
import java.util.Base64;

@Configuration
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {

    private String secret;
    private ExpirationConfig expiration;

    @PostConstruct
    public void init() {
        if (secret == null || secret.isEmpty()) {
            secret = "default-secret-key-change-in-production-must-be-at-least-64-bytes-long";
        }
        if (secret.length() < 64) {
            byte[] padded = new byte[64];
            System.arraycopy(secret.getBytes(), 0, padded, 0, Math.min(secret.getBytes().length, 64));
            secret = Base64.getEncoder().encodeToString(padded);
        }
    }

    public String getSecret() {
        return secret;
    }

    public void setSecret(String secret) {
        this.secret = secret;
    }

    public ExpirationConfig getExpiration() {
        return expiration;
    }

    public void setExpiration(ExpirationConfig expiration) {
        this.expiration = expiration;
    }

    public long getExpirationInSeconds() {
        if (expiration == null) {
            return 86400;
        }
        return expiration.getValueInSeconds();
    }

    public static class ExpirationConfig {
        private long defaultValue = 86400;
        private String unit = "seconds";
        private long accessToken = 3600;
        private long refreshToken = 604800;

        public long getDefault() {
            return defaultValue;
        }

        public void setDefault(long defaultValue) {
            this.defaultValue = defaultValue;
        }

        public String getUnit() {
            return unit;
        }

        public void setUnit(String unit) {
            this.unit = unit;
        }

        public long getAccessToken() {
            return accessToken;
        }

        public void setAccessToken(long accessToken) {
            this.accessToken = accessToken;
        }

        public long getRefreshToken() {
            return refreshToken;
        }

        public void setRefreshToken(long refreshToken) {
            this.refreshToken = refreshToken;
        }

        public long getValueInSeconds() {
            if (unit == null || unit.equalsIgnoreCase("seconds")) {
                return defaultValue;
            } else if (unit.equalsIgnoreCase("minutes")) {
                return defaultValue * 60;
            } else if (unit.equalsIgnoreCase("hours")) {
                return defaultValue * 3600;
            }
            return defaultValue;
        }

        public long getAccessTokenInSeconds() {
            if (unit == null || unit.equalsIgnoreCase("seconds")) {
                return accessToken;
            } else if (unit.equalsIgnoreCase("minutes")) {
                return accessToken * 60;
            } else if (unit.equalsIgnoreCase("hours")) {
                return accessToken * 3600;
            }
            return accessToken;
        }

        public long getRefreshTokenInSeconds() {
            if (unit == null || unit.equalsIgnoreCase("seconds")) {
                return refreshToken;
            } else if (unit.equalsIgnoreCase("minutes")) {
                return refreshToken * 60;
            } else if (unit.equalsIgnoreCase("hours")) {
                return refreshToken * 3600;
            }
            return refreshToken;
        }
    }
}
