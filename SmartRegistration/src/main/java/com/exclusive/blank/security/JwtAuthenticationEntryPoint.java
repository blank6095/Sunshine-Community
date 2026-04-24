package com.exclusive.blank.security;

import com.exclusive.blank.dto.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationEntryPoint.class);

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
        this.objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException {
        String requestPath = request.getRequestURI();
        String httpMethod = request.getMethod();
        String contextPath = request.getContextPath();

        if (contextPath != null && !contextPath.isEmpty() && requestPath.startsWith(contextPath)) {
            requestPath = requestPath.substring(contextPath.length());
        }

        String authHeader = request.getHeader("Authorization");
        String tokenMissingReason = null;

        if (authHeader == null || authHeader.isEmpty()) {
            tokenMissingReason = "请求头中未找到Authorization字段";
            logger.warn("认证失败 - TOKEN_MISSING | 请求路径: {} | 请求方法: {} | 原因: {}",
                requestPath, httpMethod, tokenMissingReason);
        } else if (!authHeader.startsWith("Bearer ")) {
            tokenMissingReason = "Authorization字段格式错误，应为 'Bearer <token>' 格式";
            logger.warn("认证失败 - TOKEN_INVALID | 请求路径: {} | 请求方法: {} | 原因: {}",
                requestPath, httpMethod, tokenMissingReason);
        } else {
            String token = authHeader.substring(7);
            if (token.isEmpty()) {
                tokenMissingReason = "令牌为空";
                logger.warn("认证失败 - TOKEN_MISSING | 请求路径: {} | 请求方法: {} | 原因: {}",
                    requestPath, httpMethod, tokenMissingReason);
            } else {
                logger.warn("认证失败 - TOKEN_INVALID | 请求路径: {} | 请求方法: {} | 令牌: {}...",
                    requestPath, httpMethod, token.substring(0, Math.min(10, token.length())));
            }
        }

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ErrorResponse errorResponse;
        if (tokenMissingReason != null && (authHeader == null || !authHeader.startsWith("Bearer ") || authHeader.substring(7).isEmpty())) {
            errorResponse = ErrorResponse.tokenMissing();
        } else {
            errorResponse = ErrorResponse.tokenInvalid();
        }

        errorResponse.setRequestPath(requestPath);
        errorResponse.setRequestMethod(httpMethod);

        String jsonResponse = objectMapper.writeValueAsString(errorResponse);
        response.getWriter().write(jsonResponse);
    }
}
